"""Prerequisite Skill Graph Engine for CBSE Class 9 Mathematics & targeted remediation."""
from typing import Dict, List

# Directed prerequisite mapping tree
SKILL_DEPENDENCIES: Dict[str, List[str]] = {
    "Algebra": [],
    "Identities": ["Algebra"],
    "Factorisation": ["Identities", "Algebra"],
    "Linear Equations": ["Algebra"],
    "Quadratics": ["Factorisation", "Identities", "Algebra"]
}

def get_prerequisites(topic: str) -> List[str]:
    """Return the prerequisite chain for a given topic."""
    return SKILL_DEPENDENCIES.get(topic, [])

def diagnose_learning_gap(failed_topic: str) -> str:
    """Recursively identify the root prerequisite gap when a student fails a topic."""
    prereqs = get_prerequisites(failed_topic)
    if not prereqs:
        return failed_topic
    # Return the foundational prerequisite node to target first
    return prereqs[0]
