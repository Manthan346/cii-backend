import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { logoutUser } from "./authService";

function getInitials(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Fetches the current candidate's profile once and exposes name/initials,
 * plus a working logout(). Used by both Sidebar and Topbar so the avatar/
 * name are consistent everywhere instead of hardcoded.
 *
 * Field mapping confirmed from the actual /candidate-profile response:
 * { data: { personalInfo: { candidate_first_name, candidate_last_name, ... } } }
 */
export function useAuthUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: "", initials: "?", role: "Candidate" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { data } = await API.get("/candidate/candidate-profile");
        const personalInfo = data?.data?.personalInfo ?? {};

        const fullName = [
          personalInfo.candidate_first_name,
          personalInfo.candidate_last_name,
        ]
          .filter(Boolean)
          .join(" ");
        const role = "Candidate";

        if (!cancelled) {
          setUser({ fullName, initials: getInitials(fullName), role });
        }
      } catch (err) {
        // Leave the "?" placeholder rather than crashing the whole layout
        // if the profile fetch fails (e.g. token expired).
        if (!cancelled) setUser({ fullName: "", initials: "?", role: "Candidate" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      // The session is cleared by logoutUser even when the API is unavailable.
    }
    navigate("/LoginPage", { replace: true });
  }, [navigate]);

  return { ...user, loading, logout };
}