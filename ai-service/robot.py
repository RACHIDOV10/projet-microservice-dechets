from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from typing import Dict
import asyncio
import time

app = FastAPI()

# Robot state
robot_stream_requests: Dict[str, bool] = {}
latest_frames: Dict[str, bytes] = {}
last_frame_time: Dict[str, float] = {}

# ===== STREAM CONTROL =====

@app.get("/robots/{robot_id}/should_stream")
def should_stream(robot_id: str):
    return robot_stream_requests.get(robot_id, False)


@app.post("/robots/{robot_id}/request_stream")
def request_stream(robot_id: str):
    robot_stream_requests[robot_id] = True
    return {"streaming": True}


@app.post("/robots/{robot_id}/stop_stream")
def stop_stream(robot_id: str):
    robot_stream_requests[robot_id] = False
    return {"streaming": False}


# ===== FRAME RECEIVER =====

@app.post("/robots/{robot_id}/frame")
async def receive_frame(robot_id: str, request: Request):
    body = await request.body()
    latest_frames[robot_id] = body
    last_frame_time[robot_id] = time.time()
    return {"ok": True}


# ===== SAFE MJPEG STREAM =====

@app.get("/robots/{robot_id}/stream")
async def video_stream(robot_id: str):

    async def gen():
        last_sent = None

        try:
            while True:
                frame = latest_frames.get(robot_id)

                # Send only if frame changed
                if frame and frame != last_sent:
                    last_sent = frame
                    yield (
                        b"--frame\r\n"
                        b"Content-Type: image/jpeg\r\n\r\n" +
                        frame +
                        b"\r\n"
                    )

                # HARD throttle (server-side protection)
                await asyncio.sleep(0.1)  # 10 FPS max

        except asyncio.CancelledError:
            # Browser disconnected cleanly
            return

    return StreamingResponse(
        gen(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


# ===== HEALTH CHECK =====

@app.get("/")
def root():
    return {"status": "ok"}
