"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, User, Search, Settings, Loader2, LogOut } from 'lucide-react';
import { EventCard } from '@/components/EventCard';
import { AddCelebrationModal } from '@/components/AddCelebrationModal';
import { useAuth } from '@/context/AuthContext';
import { celebrationService, Celebration } from '@/lib/celebrationService';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const unsubscribe = celebrationService.subscribeToCelebrations(user.uid, (data) => {
        setCelebrations(data);
      });
      return () => unsubscribe();
    }
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getDaysLeft = (date: Date) => {
    const today = new Date();
    const eventDate = new Date(date);
    eventDate.setFullYear(today.getFullYear());

    if (eventDate < today) {
      eventDate.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = eventDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <nav className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-white/5 bg-background/50 px-6 backdrop-blur-xl">
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-muted-foreground">Good evening, {user?.displayName?.split(' ')[0] || 'Walter'}</span>
          <h1 className="text-2xl font-black tracking-tight italic">Celebrations</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/10 ring-2 ring-purple-500/20">
            <img
              src={user?.photoURL || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-lg px-6 py-8">
        {/* Featured Events */}
        <section className="space-y-6">
          {celebrations.slice(0, 2).map((event) => (
            <EventCard
              key={event.id}
              name={event.name}
              type={event.type as any}
              date={event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              daysLeft={getDaysLeft(event.date)}
              progress={getDaysLeft(event.date) < 10 ? 90 : 50}
              highlight={event.type === 'birthday' ? 'pink' : event.type === 'anniversary' ? 'blue' : 'purple'}
            />
          ))}

          {celebrations.length === 0 && (
            <div className="glass rounded-[2rem] p-10 text-center space-y-4">
              <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-muted-foreground">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="font-bold">No celebrations yet</h3>
              <p className="text-xs text-muted-foreground">Add your first friend's birthday or anniversary to start the countdown!</p>
            </div>
          )}
        </section>

        {/* Upcoming List */}
        {celebrations.length > 2 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm border-b-2 border-primary/20 pb-1 font-black uppercase tracking-widest opacity-60">Upcoming</h2>
              <div className="flex -space-x-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {celebrations.slice(2).map((event) => (
                <div key={event.id} className="glass flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5`}>
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{event.name}</h4>
                      <p className="text-xs text-muted-foreground">In {getDaysLeft(event.date)} days</p>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 text-muted-foreground opacity-30" />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 flex flex-col items-center gap-2 md:bottom-10">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-110 active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-tighter opacity-50">Add New</span>
      </div>

      <AddCelebrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 z-50 flex w-full items-center justify-around border-t border-white/5 bg-background/80 px-6 py-4 backdrop-blur-xl md:hidden">
        <button className="text-primary">
          <Calendar className="h-6 w-6" />
        </button>
        <button className="text-muted-foreground/40">
          <Search className="h-6 w-6" />
        </button>
        <div className="w-12 h-6" /> {/* FAB Spacer */}
        <button className="text-muted-foreground/40">
          <User className="h-6 w-6" />
        </button>
        <button className="text-muted-foreground/40">
          <Settings className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
