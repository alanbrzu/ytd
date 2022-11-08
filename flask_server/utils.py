from pytube import YouTube
from pytube.cli import on_progress
import os
import re
from pathlib import Path
from dotenv import load_dotenv


load_dotenv()
__env_dir = os.environ["DOWNLOAD_DIR"]

output_dir = __env_dir

# Download function
def download_mp3_from_yt(url):
    yt = YouTube(
        url,
        on_progress_callback=on_progress,
        # proxies=my_proxies,
        use_oauth=True,
        allow_oauth_cache=True,
    )
    status = yt.vid_info["playabilityStatus"]["status"]
    print(status)
    try:
        isinstance(yt.length, int)
    except:
        print(f"Could not get video length for {id}. Skipping download.")
        return

    # If time > 4hr
    # MAYBE DELETE THIS
    if yt.length > 14400:
        print(f"video_id {id} is longer than 4 hours, will not download.")
        return

    video = yt.streams.filter(only_audio=True).first()

    # Download as mp4
    try:
        song_title_raw = yt.title
        print("Got song")
    except:
        print(f"Unable to get title for id {id}. Skipping download.")
        return

    song_title = re.sub(r"(\s)|(-)", "", song_title_raw).lower().strip()
    song_path = f"{song_title}"

    download_path = f"{output_dir}{song_path}"
    out_file = video.download(download_path)

    # Save and rename the file (mp4 -> mp3)
    base, ext = os.path.splitext(out_file)
    new_file = base + ".mp3"
    os.rename(out_file, new_file)

    # replace the parent with the mp3
    p = Path(new_file).absolute()
    parent_dir = p.parents[1]
    p.rename(parent_dir / p.name.replace(" ", "").replace("-", "").lower())
    # delete the child dir
    os.rmdir(download_path)

    # result of success
    print(f"{song_path} has been successfully downloaded. Video id: {url}")
    return song_path, output_dir


# Download loop
def download_loop(video_urls):
    for url in video_urls:
        try:
            song, path = download_mp3_from_yt(url)
            return [song, path]
        except:
            print(f"Failed to download: {url}")
    print(f"Destination: {output_dir}")


def run(_arr):
    x, y = download_loop(_arr)
    return x, y
