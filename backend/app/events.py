from typing import Callable

_listeners: dict[str, list[Callable]] = {}

def on(event_name: str, callback: Callable):
    _listeners.setdefault(event_name, []).append(callback)

def emit(event_name: str, data: dict):
    for cb in _listeners.get(event_name, []):
        try:
            cb(data)
        except Exception as e:
            print(f"Event handler error: {e}")
