"""
Simple Natural Language Symptom Extractor

Converts free-form user text into a list of known symptom identifiers
matching the model's expected format (lowercase with underscores).

Design goals:
- Zero new dependencies (uses stdlib only)
- Deterministic and explainable matching
- Works with both typed and spoken natural language

Approach:
1) Normalize text: lowercase, strip punctuation
2) Phrase match: check each known multi-word symptom (underscores -> spaces)
3) Synonym mapping: common layperson phrases to canonical symptoms
4) Token match with close similarity using difflib (as a last resort)
"""
from __future__ import annotations

from typing import Iterable, List, Set
import re
import difflib


class SymptomExtractor:
    def __init__(self, known_symptoms: Iterable[str] | None = None) -> None:
        self.known: List[str] = sorted(set(map(str, known_symptoms or [])))
        # Precompute space-form phrases ("back pain") for fast contains checks
        self.phrases: List[str] = [s.replace('_', ' ') for s in self.known]
        # Build quick lookup
        self.known_set: Set[str] = set(self.known)
        # A small, pragmatic synonym map for frequent layperson expressions
        # Add more entries here safely without changing model behavior
        self.synonyms: dict[str, str] = {
            # Fever
            "fever": "high_fever",
            "feverish": "high_fever",
            "temperature": "high_fever",
            # Pain variants
            "back pain": "back_pain",
            "backache": "back_pain",
            "lower back pain": "back_pain",
            "stomach pain": "abdominal_pain",
            "belly pain": "abdominal_pain",
            "tummy pain": "abdominal_pain",
            "head ache": "headache",
            # GI
            "vomit": "vomiting",
            "vomiting": "vomiting",
            "nauseated": "nausea",
            # Respiratory
            "coughing": "cough",
            "sneeze": "continuous_sneezing",
            "sneezing": "continuous_sneezing",
        }

    @staticmethod
    def _normalize_text(text: str) -> str:
        text = text.lower()
        # Keep letters, digits, spaces; turn dashes/underscores to spaces
        text = text.replace('_', ' ').replace('-', ' ')
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        # Collapse multiple spaces
        text = re.sub(r"\s+", " ", text).strip()
        return text

    @staticmethod
    def _normalize_symptom(s: str) -> str:
        return s.strip().lower().replace(' ', '_').replace('-', '_')

    def _phrase_match(self, norm_text: str) -> List[str]:
        found: List[str] = []
        # Check longer phrases first so we capture multi-word symptoms accurately
        for phrase, original in sorted(zip(self.phrases, self.known), key=lambda x: -len(x[0])):
            # whole-phrase contains check (word boundary safe)
            # Example: "back pain" in text -> back_pain
            # Only match if it's an EXACT phrase match, not substring
            if re.search(rf"\b{re.escape(phrase)}\b", norm_text):
                found.append(original)
                # Remove matched phrase from text to prevent token-level re-matching later
                norm_text = re.sub(rf"\b{re.escape(phrase)}\b", "", norm_text)
        return found

    def _synonym_match(self, norm_text: str) -> List[str]:
        hits: List[str] = []
        # Sort by length descending to match longer phrases first
        sorted_synonyms = sorted(self.synonyms.items(), key=lambda x: -len(x[0]))
        for k, v in sorted_synonyms:
            if re.search(rf"\b{re.escape(k)}\b", norm_text):
                if v in self.known_set:
                    hits.append(v)
                    # Remove matched synonym to prevent token-level re-matching
                    norm_text = re.sub(rf"\b{re.escape(k)}\b", "", norm_text)
        return hits

    def _token_match_fuzzy(self, norm_text: str, already_matched: Set[str]) -> List[str]:
        """
        Token-level fallback: for each word try to find a close known symptom token
        Useful for single-word symptoms like "cough" or when user types "headache"
        Only matches COMPLETE single-word symptoms, not partial token matches.
        """
        tokens = [t for t in norm_text.split(' ') if t and len(t) > 2]  # Ignore very short words
        results: Set[str] = set()
        
        # Only match complete single-word symptoms (no underscore = single word)
        single_word_symptoms = [s for s in self.known if '_' not in s]
        
        for t in tokens:
            # Skip if this token was already part of a matched phrase
            if any(t in matched.replace('_', ' ') for matched in already_matched):
                continue
                
            # Exact token match to single-word symptoms
            if t in single_word_symptoms:
                results.add(t)
                continue
            
            # Exact synonym match
            if t in self.synonyms:
                mapped = self.synonyms[t]
                if mapped in self.known_set:
                    results.add(mapped)
                    continue
            
            # Very close fuzzy match only for single-word symptoms (cutoff 0.95 = very strict)
            close = difflib.get_close_matches(t, single_word_symptoms, n=1, cutoff=0.95)
            if close:
                results.add(close[0])
        
        return list(sorted(results))

    def extract(self, text: str) -> List[str]:
        """
        Extract a deduplicated list of model-ready symptoms from free text.
        Returns: list of symptom identifiers like ["back_pain", "high_fever"]
        """
        if not text:
            return []
        norm = self._normalize_text(text)

        found: List[str] = []
        already_matched: Set[str] = set()
        
        # 1) Phrase-level exacts (most specific - do first)
        phrase_matches = self._phrase_match(norm)
        found.extend(phrase_matches)
        already_matched.update(phrase_matches)
        
        # 2) Synonym phrases
        synonym_matches = self._synonym_match(norm)
        found.extend(synonym_matches)
        already_matched.update(synonym_matches)
        
        # 3) Token-level fuzzy fallback (only for unmatched single-word symptoms)
        token_matches = self._token_match_fuzzy(norm, already_matched)
        found.extend(token_matches)

        # Deduplicate while preserving order of first appearance in text
        seen: Set[str] = set()
        ordered: List[str] = []
        for s in found:
            if s not in seen:
                seen.add(s)
                ordered.append(s)

        return ordered
