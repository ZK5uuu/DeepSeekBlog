"use client";
import React from 'react';
import Link from 'next/link';
import { FaPlusCircle } from 'react-icons/fa';

export default function CreateMusicButton() {
  return (
    <Link
      href="/music/create"
      className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 z-50"
      title="创建音乐"
    >
      <FaPlusCircle className="text-2xl" />
    </Link>
  );
} 