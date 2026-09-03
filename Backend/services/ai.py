"""Core AI content pipeline. Pure logic — no UI, no printing."""

import os
import re
from dataclasses import dataclass, asdict
from typing import List

from huggingface_hub import InferenceClient

DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

CHARACTER_STYLE = (
    "Highly detailed cinematic character, ultra realistic, "
    "dramatic lighting, 8k quality, professional movie concept art"
)


@dataclass
class Scene:
    scene: str
    description: str
    visual_prompt: str

    def to_dict(self):
        return asdict(self)


class MissingTokenError(RuntimeError):
    pass


def get_client(token: str | None = None) -> InferenceClient:
    token = token or os.environ.get("HF_TOKEN")
    if not token:
        raise MissingTokenError(
            "No Hugging Face token found. Set HF_TOKEN in your environment or .env file."
        )
    return InferenceClient(provider="hf-inference", api_key=token)


def build_prompt(idea: str, num_scenes: int, tone: str) -> str:
    scene_lines = "\n".join(f"Scene {i}: ..." for i in range(1, num_scenes + 1))
    return f"""Create a cinematic short video script about:

{idea}

Requirements:
- Exactly {num_scenes} scenes
- Tone: {tone}
- Detailed, visually concrete scene descriptions
- Engaging storytelling
- Suitable for AI video generation

Format exactly like:

{scene_lines}
"""


def generate_script(
    idea: str,
    num_scenes: int = 5,
    tone: str = "Cinematic",
    model: str = DEFAULT_MODEL,
    max_tokens: int = 1000,
    temperature: float = 0.7,
    client: InferenceClient | None = None,
) -> str:
    """Generate a scene-by-scene script from a one-line idea."""
    client = client or get_client()
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": build_prompt(idea, num_scenes, tone)}],
        max_tokens=max_tokens,
        temperature=temperature,
    )
    return response.choices[0].message.content.strip()


def split_into_scenes(script: str, style: str = CHARACTER_STYLE) -> List[Scene]:
    """Parse 'Scene N: description' lines into Scene objects."""
    scenes: List[Scene] = []
    pattern = re.compile(r"^\**\s*(Scene\s*\d+)\s*\**\s*[::]\s*(.+)$", re.IGNORECASE)

    for line in script.splitlines():
        match = pattern.match(line.strip())
        if not match:
            continue
        label, description = match.group(1).strip(), match.group(2).strip()
        description = description.strip("*_ ")
        scenes.append(
            Scene(
                scene=label,
                description=description,
                visual_prompt=f"{description}, {style}",
            )
        )
    return scenes


def generate_character_design(script: str = "") -> str:
    return CHARACTER_STYLE


def generate_storyboard(scenes: List[Scene], design: str = CHARACTER_STYLE) -> str:
    return "\n\n".join(
        f"{s.scene} | {s.description} | STYLE: {design}" for s in scenes
    )


def run_pipeline(idea: str, num_scenes: int = 5, tone: str = "Cinematic", **kwargs):
    """Run the whole pipeline. Returns (script, scenes, design, storyboard)."""
    script = generate_script(idea, num_scenes=num_scenes, tone=tone, **kwargs)
    design = generate_character_design(script)
    scenes = split_into_scenes(script, style=design)
    storyboard = generate_storyboard(scenes, design)
    return script, scenes, design, storyboard
