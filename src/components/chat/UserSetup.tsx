"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserSetupProps {
  onJoin: (userData: { name: string; color: string }) => void;
}

const PRESET_COLORS = [
  "#AF3029", // red-600
  "#BC5215", // orange-600
  "#AD8301", // yellow-600
  "#66800B", // green-600
  "#24837B", // cyan-600
  "#205EA6", // blue-600
  "#5E409D", // purple-600
  "#A02F6F", // magenta-600
];

export function UserSetup({ onJoin }: UserSetupProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    // Simulate a brief loading state
    await new Promise((resolve) => setTimeout(resolve, 500));

    onJoin({
      name: name.trim(),
      color: selectedColor,
    });

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Skribbl.chat</CardTitle>
          <CardDescription>
            Pick your name and color to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Choose Your Color</Label>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`
                      w-12 h-12 rounded-full border-2 transition-all
                      ${
                        selectedColor === color
                          ? "border-foreground scale-110"
                          : "border-border hover:border-foreground/50"
                      }
                    `}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: selectedColor }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: selectedColor }}
              >
                {name || "Your Name"}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? "Joining..." : "Join Chat Room"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
