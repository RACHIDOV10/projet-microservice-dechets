from typing import Dict
import time

robot_stream_requests: Dict[str, bool] = {}
latest_frames: Dict[str, bytes] = {}
last_frame_time: Dict[str, float] = {}
