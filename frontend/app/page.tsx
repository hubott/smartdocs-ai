"use client";

import { useEffect, useState } from "react";
import { api } from "./lib/api";

interface UserResponse {
  email: string;
  username: string;
  id: string;
}

export default function HomePage() {
  const [user, setUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    api<UserResponse>("/api/protected/me", {
      credentials: "include"
    })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      <h1>Welcome</h1>
      {user ? (
        <p>Logged in as: {user.username}</p>
      ) : (
        <a href="/login">Login</a>
      )}
    </div>
  );
}
