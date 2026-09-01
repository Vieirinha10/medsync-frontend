#!/usr/bin/env python3
"""Audita a distribuição A/B/C/D dos desafios visuais nativos."""

from __future__ import annotations

import argparse
import ast
import re
from collections import Counter
from pathlib import Path


CHALLENGE_PATTERN = re.compile(
    r"id: '(desafio-visual-\d{3})',[\s\S]*?options: \[\n([\s\S]*?)    \],"
)
OPTION_PATTERN = re.compile(r"\{\s*id:\s*'([^']+)'[\s\S]*?\}")
POSITION_LABELS = "ABCD"


def load_answers(path: Path) -> dict[str, str]:
    module = ast.parse(path.read_text(encoding="utf-8"))
    for node in module.body:
        if not isinstance(node, ast.Assign):
            continue
        if not any(
            isinstance(target, ast.Name)
            and target.id == "BUILTIN_CHALLENGE_ANSWERS"
            for target in node.targets
        ):
            continue
        catalog = ast.literal_eval(node.value)
        return {
            challenge_id: answer["correct_option_id"]
            for challenge_id, answer in catalog.items()
        }
    raise ValueError("BUILTIN_CHALLENGE_ANSWERS não encontrado.")


def load_option_orders(path: Path) -> list[tuple[str, list[str]]]:
    source = path.read_text(encoding="utf-8")
    return [
        (challenge_id, OPTION_PATTERN.findall(options_block))
        for challenge_id, options_block in CHALLENGE_PATTERN.findall(source)
    ]


def format_counts(counts: Counter[int]) -> str:
    return ", ".join(
        f"{label}={counts.get(index, 0)}"
        for index, label in enumerate(POSITION_LABELS)
    )


def audit(frontend_file: Path, api_file: Path) -> None:
    answers = load_answers(api_file)
    challenges = load_option_orders(frontend_file)
    if len(challenges) != 150 or len(answers) != 150:
        raise ValueError(
            f"Catálogo incompleto: frontend={len(challenges)}, API={len(answers)}."
        )

    positions: list[int] = []
    for challenge_id, option_ids in challenges:
        if len(option_ids) != 4:
            raise ValueError(f"{challenge_id} não possui quatro alternativas.")
        correct_id = answers.get(challenge_id)
        if correct_id not in option_ids:
            raise ValueError(
                f"Gabarito de {challenge_id} não corresponde às alternativas públicas."
            )
        positions.append(option_ids.index(correct_id))

    total_counts = Counter(positions)
    if max(total_counts.values()) - min(total_counts.values()) > 1:
        raise ValueError(f"Distribuição global desequilibrada: {format_counts(total_counts)}")

    for start in range(0, len(positions), 10):
        block_counts = Counter(positions[start : start + 10])
        if any(block_counts.get(index, 0) not in {2, 3} for index in range(4)):
            first = start + 1
            last = min(start + 10, len(positions))
            raise ValueError(
                f"Bloco {first:03d}–{last:03d} desequilibrado: "
                f"{format_counts(block_counts)}"
            )

    print(f"Distribuição global aprovada: {format_counts(total_counts)}")
    print("Todos os 15 blocos de 10 possuem 2 ou 3 respostas em cada posição.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--frontend-file",
        type=Path,
        default=Path("src/data/visualChallenges.js"),
    )
    parser.add_argument("--api-file", type=Path, required=True)
    args = parser.parse_args()
    audit(args.frontend_file, args.api_file)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
