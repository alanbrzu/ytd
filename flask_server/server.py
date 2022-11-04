from quart import Quart, request, jsonify, send_file
import json
from script import *
from dotenv import load_dotenv

app = Quart(__name__)

load_dotenv()
__env_dir = os.environ["DOWNLOAD_DIR"]

output_dir = __env_dir

# First they need to POST and make the download
# Once that goes through, change the button and download
# IMPORTANT -- Consider age restricted videos, can we get a way to login yt in frontend,
# and have that register with pytube oauth

# POST
@app.route("/home/download", methods=["POST"])
async def return_info():
    content_type = request.headers.get("Content-type")
    if content_type == "application/json":
        file = await request.json
        _file = list(file.values())[0].replace(".", "")
        print(_file)
        return await send_file(
            f"{output_dir}{_file}.mp3",
            as_attachment=True,
        )


# POST
@app.route("/home/mp3", methods=["POST"])
async def receive_info():
    content_type = request.headers.get("Content-type")
    if content_type == "application/json":
        urls = await request.json
        _urls = list(urls.values())[0]
        print(_urls)
        names = []
        for i in _urls:
            x, y = download_multiple([i])
            names.append(x)
        return jsonify([names])
    else:
        return content_type


if __name__ == "__main__":
    app.run()
