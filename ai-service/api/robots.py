from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import asyncio
import time

# Import the shared state objects
from services.stream_manager import robot_stream_requests, latest_frames, last_frame_time

router = APIRouter(prefix="/robots")

@router.get("/{robot_id}/should_stream")
def should_stream(robot_id: str):
    return robot_stream_requests.get(robot_id, False)

@router.post("/{robot_id}/request_stream")
def request_stream(robot_id: str):
    robot_stream_requests[robot_id] = True
    return {"streaming": True}

@router.post("/{robot_id}/stop_stream")
def stop_stream(robot_id: str):
    robot_stream_requests[robot_id] = False
    return {"streaming": False}

@router.post("/{robot_id}/frame")
async def receive_frame(robot_id: str, request: Request):
    body = await request.body()
    latest_frames[robot_id] = body
    last_frame_time[robot_id] = time.time()
    return {"ok": True}

@router.get("/{robot_id}/stream")
async def video_stream(robot_id: str):

    async def gen():
        last_sent = None
        while True:
            frame = latest_frames.get(robot_id)
            if frame and frame != last_sent:
                last_sent = frame
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n"
                    + frame +
                    b"\r\n"
                )
            await asyncio.sleep(0.1)

    return StreamingResponse(
        gen(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )
