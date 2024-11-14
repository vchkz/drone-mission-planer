import asyncio
import json
import math
import numpy as np
import websockets
from scipy.interpolate import CubicSpline
from scipy.integrate import quad

# Настройки
move_speed_mps = 2000  # Скорость движения в метрах в секунду
fps = 10  # Частота кадров

max_roll_angle = 45  # Максимальный угол крена
max_pitch_angle = 30  # Максимальный угол тангажа

# Переменные для преобразования градусов в метры
meters_per_degree_lat = 111320

# Переменные для данных
waypoints = []
cs_lat = cs_lng = cs_alt = None
max_curvature = 0
move_speed = move_speed_mps / (fps * meters_per_degree_lat)


# Функция для инициализации сплайнов
def initialize_splines(points):
    global cs_lat, cs_lng, cs_alt, max_curvature

    # Преобразуем waypoints в numpy-массив
    points = np.array([[wp["lat"], wp["lng"], wp["alt"]] for wp in points])
    points = np.vstack([points, points[0]])  # Замыкаем путь

    # Вычисляем параметрическую длину кривой
    t = np.linspace(0, len(points) - 1, len(points))
    cs_lat = CubicSpline(t, points[:, 0], bc_type='periodic')
    cs_lng = CubicSpline(t, points[:, 1], bc_type='periodic')
    cs_alt = CubicSpline(t, points[:, 2], bc_type='periodic')

    # Нахождение максимальной кривизны
    t_values = np.linspace(0, len(points) - 1, 1000)
    max_curvature = max(abs(signed_curvature(t)) for t in t_values)


# Функция для вычисления длины дуги
def curve_length(t1, t2):
    result, _ = quad(lambda t: math.sqrt(cs_lat(t, 1) ** 2 + cs_lng(t, 1) ** 2), t1, t2)
    return result


# Функция для нахождения параметра t на заданной длине
def find_t_for_distance(t_curr, distance):
    step = 0.001
    traveled = 0
    while traveled < distance:
        next_t = t_curr + step
        if next_t >= len(waypoints) - 1:
            next_t = 999
            return next_t
        segment_length = curve_length(t_curr, next_t)
        if traveled + segment_length >= distance:
            return next_t
        traveled += segment_length
        t_curr = next_t
    return t_curr


# Функция для вычисления кривизны
def signed_curvature(t):
    dx = cs_lat(t, 1)
    dy = cs_lng(t, 1)
    ddx = cs_lat(t, 2)
    ddy = cs_lng(t, 2)

    numerator = dx * ddy - dy * ddx
    denominator = (dx ** 2 + dy ** 2) ** 1.5
    curvature = numerator / denominator if denominator != 0 else 0

    return curvature


async def send_data(websocket, path):
    global waypoints, move_speed

    # Ожидаем первое сообщение с данными о точках и скорости
    while True:
        message = await websocket.recv()
        data = json.loads(message)

        if data.get("type") == "waypoints":
            waypoints = data["data"]
            print("Получены контрольные точки:", waypoints)

            # Инициализируем сплайны
            initialize_splines(waypoints)
            print("Сплайны инициализированы.")

            await websocket.send(json.dumps({"type": "waypoints", "data": waypoints}))
            print("Точки отправлены.")

        # Принимаем и устанавливаем начальную скорость
        elif data.get("type") == "speed":
            move_speed = data["data"] / (fps * meters_per_degree_lat)
            print(f"Начальная скорость установлена: {move_speed} м/с", {data["data"]})
            break  # Переход к ожиданию команды 'start'

    while True:
        while True:
            message = await websocket.recv()
            data = json.loads(message)
            if data.get("command") == "start":
                print("Команда 'start' получена.")
                break

        t_curr = 0.0

        while True:
            lat = float(cs_lat(t_curr))
            lng = float(cs_lng(t_curr))
            alt = float(cs_alt(t_curr))

            next_t = find_t_for_distance(t_curr, move_speed)

            if next_t >= len(waypoints) - 1:
                print("Конец маршрута")

                break

            next_lat = float(cs_lat(next_t))
            next_lng = float(cs_lng(next_t))
            next_alt = float(cs_alt(next_t))

            # Вычисляем угол движения
            current_angle = math.atan2(next_lng - lng, next_lat - lat)

            # Вычисляем кривизну и угол крена
            curve = signed_curvature(t_curr)
            normalized_curvature = curve / max_curvature if max_curvature != 0 else 0
            roll_angle = normalized_curvature * max_roll_angle
            roll_angle = min(max(roll_angle, -max_roll_angle), max_roll_angle)

            # Вычисляем горизонтальное расстояние и угол тангажа
            horizontal_distance = math.sqrt(
                ((next_lat - lat) * meters_per_degree_lat) ** 2 +
                ((next_lng - lng) * meters_per_degree_lat) ** 2
            )
            vertical_distance = next_alt - alt
            pitch_angle = math.atan2(vertical_distance, horizontal_distance)
            pitch_angle = min(max(math.degrees(pitch_angle), -max_pitch_angle), max_pitch_angle)

            # Отправка данных
            data = {
                "type": "position",
                "data": {
                    "lat": lat,
                    "lng": lng,
                    "alt": round(alt, 1),
                    "yaw_angle": round(math.degrees(current_angle), 2),
                    "roll_angle": round(float(roll_angle), 2),
                    "pitch_angle": round(pitch_angle, 2)
                }
            }

            await websocket.send(json.dumps(data))

            t_curr = next_t
            await asyncio.sleep(1 / fps)


# Запуск WebSocket-сервера
start_server = websockets.serve(send_data, "localhost", 8080)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
