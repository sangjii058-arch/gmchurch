/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Heart, 
  Users, 
  Music, 
  BookOpen,
  Instagram,
  Youtube,
  Facebook,
  Play,
  Video
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// @ts-ignore
import churchVideo from "@/pictures/갓을_벗겨_동영상_만들어_줘_202605261611.mp4";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "교회소개", href: "#about" },
    { name: "예배안내", href: "#worship" },
    { name: "사역안내", href: "#ministry" },
    { name: "미디어 갤러리", href: "#media" },
    { name: "교회소식", href: "#community" },
    { name: "오시는길", href: "#contact" },
  ];

  const videos = [
    {
      title: "갓을 벗겨 (교회 특별 영상)",
      desc: "광명교회 성도들과 함께하는 은혜롭고 따뜻한 현장 기록 영상입니다.",
      url: churchVideo,
      duration: "2:14",
      date: "2026.05.26",
      isLocal: true,
      thumbnail: "https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "주일 2부 예배 실시간 중계",
      desc: "매주 일요일 오전 11시에 드려지는 주일 2부 예배 실시간 라이브 영상입니다.",
      url: "https://assets.mixkit.co/videos/preview/mixkit-worship-leader-singing-in-church-41566-large.mp4",
      duration: "1:20:00",
      date: "2026.05.24",
      isLocal: false,
      thumbnail: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "할렐루야 찬양대 - 은혜 아니면",
      desc: "주일 2부 예배 중 드려진 할렐루야 찬양대의 은혜로운 특별 찬양 영상입니다.",
      url: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-pianist-playing-classical-music-42289-large.mp4",
      duration: "5:30",
      date: "2026.05.17",
      isLocal: false,
      thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
          scrolled ? "bg-surface/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  scrolled ? "text-on-surface" : "text-white/90"
                )}
              >
                {link.name}
              </a>
            ))}
            <button className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-all">
              온라인 헌금
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className={scrolled ? "text-primary" : "text-white"} /> : <Menu className={scrolled ? "text-primary" : "text-white"} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-surface pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-2xl font-serif font-medium text-on-surface border-b border-background pb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button className="bg-primary text-white w-full py-4 rounded-xl text-lg font-medium">
                온라인 헌금
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=2071&auto=format&fit=crop" 
              alt="Church Interior" 
              className="w-full h-full object-cover scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="relative z-10 text-center text-white px-6 max-w-4xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-accent font-medium tracking-widest uppercase mb-4"
            >
              하나님의 사랑으로 세상을 밝히는
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight"
            >
              광명교회에 오신 것을<br />환영합니다
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button className="bg-accent text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-accent/90 transition-all flex items-center gap-2">
                예배 안내 <ChevronRight size={20} />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all">
                교회 소개
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
          >
            <span className="text-xs uppercase tracking-widest">Scroll Down</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </motion.div>
        </section>

        {/* Worship Times Section */}
        <section id="worship" className="py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-accent font-semibold tracking-wider uppercase">Worship Times</span>
                <h2 className="text-4xl font-serif font-bold mt-4 mb-8 text-primary">예배 시간 안내</h2>
                <p className="text-on-surface/70 text-lg leading-relaxed mb-8">
                  광명교회는 매주 정성을 다해 하나님께 예배를 드립니다. 
                  함께 모여 찬양하고 말씀을 나누는 은혜의 시간에 여러분을 초대합니다.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "주일 1부 예배", time: "오전 09:00", place: "대예배실" },
                    { title: "주일 2부 예배", time: "오전 11:00", place: "대예배실" },
                    { title: "주일 오후 예배", time: "오후 02:00", place: "대예배실" },
                    { title: "수요 기도회", time: "오후 07:30", place: "소예배실" },
                    { title: "금요 철야 기도회", time: "오후 09:00", place: "대예배실" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-background pb-4">
                      <span className="font-medium text-on-surface">{item.title}</span>
                      <div className="text-right">
                        <span className="block font-serif text-primary font-semibold">{item.time}</span>
                        <span className="text-xs text-on-surface/50">{item.place}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1974&auto=format&fit=crop" 
                    alt="Worship" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-accent p-8 rounded-2xl text-white shadow-xl hidden lg:block">
                  <Clock size={32} className="mb-4" />
                  <p className="text-sm font-medium opacity-80">다음 예배까지</p>
                  <p className="text-2xl font-serif font-bold">1일 14시간 남음</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features/Ministries */}
        <section id="ministry" className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <span className="text-accent font-semibold tracking-wider uppercase">Ministries</span>
            <h2 className="text-4xl font-serif font-bold mt-4 text-primary">사역 안내</h2>
          </div>
          <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Users size={32} />, title: "교구 및 구역", desc: "서로 사랑하며 돌보는 공동체" },
              { icon: <Heart size={32} />, title: "선교 및 봉사", desc: "세상을 향한 따뜻한 나눔" },
              { icon: <Music size={32} />, title: "찬양 사역", desc: "영혼을 울리는 아름다운 찬양" },
              { icon: <BookOpen size={32} />, title: "교육 사역", desc: "다음 세대를 세우는 말씀 교육" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-surface p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all text-left border border-primary/5"
              >
                <div className="text-accent mb-6">{item.icon}</div>
                <h3 className="text-xl font-serif font-bold mb-3 text-primary">{item.title}</h3>
                <p className="text-on-surface/60 text-sm leading-relaxed">{item.desc}</p>
                <button className="mt-6 text-accent font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  자세히 보기 <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Media Gallery Section */}
        <section id="media" className="py-24 px-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-accent font-semibold tracking-wider uppercase font-sans">Media Gallery</span>
              <h2 className="text-4xl font-serif font-bold mt-4 text-primary">광명 미디어 갤러리</h2>
              <p className="text-on-surface/60 mt-3 max-w-2xl mx-auto font-sans">
                예배의 현장과 은혜로운 찬양, 교회의 소중한 순간들을 영상으로 함께 나눕니다.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Main Player */}
              <div className="lg:col-span-2 bg-primary text-white rounded-3xl p-6 shadow-2xl border border-white/10">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-6 group">
                  <video 
                    key={selectedVideo}
                    src={videos[selectedVideo].url}
                    controls
                    autoPlay={false}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3 font-sans">
                    <span className="bg-accent/20 text-accent text-xs font-semibold px-3 py-1 rounded-full border border-accent/30">
                      {videos[selectedVideo].isLocal ? "현장 스케치" : "교회 방송"}
                    </span>
                    <span className="text-sm text-white/60">{videos[selectedVideo].date}</span>
                    <span className="text-sm text-white/60 ml-auto">재생시간: {videos[selectedVideo].duration}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">
                    {videos[selectedVideo].title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed font-sans">
                    {videos[selectedVideo].desc}
                  </p>
                </div>
              </div>

              {/* Playlist Side Bar */}
              <div className="bg-surface rounded-3xl p-6 shadow-md border border-primary/5">
                <h3 className="text-lg font-serif font-bold text-primary mb-4 flex items-center gap-2 border-b border-background pb-3">
                  <Video size={20} className="text-accent" />
                  영상 재생 목록
                </h3>
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                  {videos.map((video, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVideo(idx)}
                      className={cn(
                        "w-full flex gap-3 p-3 rounded-2xl transition-all text-left group",
                        selectedVideo === idx 
                          ? "bg-primary/5 border border-primary/10 shadow-sm" 
                          : "hover:bg-background border border-transparent"
                      )}
                    >
                      <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0 bg-neutral-200">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center transition-opacity",
                          selectedVideo === idx ? "bg-primary/40 opacity-100" : "bg-black/30 opacity-0 group-hover:opacity-100"
                        )}>
                          <Play size={18} className="text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between py-0.5 font-sans">
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          selectedVideo === idx ? "text-accent" : "text-on-surface/40"
                        )}>
                          {video.isLocal ? "특별 영상" : "교회 방송"}
                        </span>
                        <h4 className={cn(
                          "text-sm font-bold font-serif line-clamp-1 mt-0.5",
                          selectedVideo === idx ? "text-primary" : "text-on-surface group-hover:text-primary transition-colors"
                        )}>
                          {video.title}
                        </h4>
                        <span className="text-[11px] text-on-surface/40 mt-1">{video.duration} | {video.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Announcements */}
        <section id="community" className="py-24 px-6 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-accent font-semibold tracking-wider uppercase">Announcements</span>
                <h2 className="text-4xl font-serif font-bold mt-4 text-primary">교회 소식</h2>
              </div>
              <button className="text-on-surface/60 font-medium hover:text-primary transition-colors flex items-center gap-2">
                전체보기 <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  date: "2024.03.24", 
                  title: "부활절 연합 예배 안내", 
                  tag: "공지사항",
                  img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                },
                { 
                  date: "2024.03.17", 
                  title: "춘계 심방 일정 안내", 
                  tag: "행사",
                  img: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=2070&auto=format&fit=crop"
                },
                { 
                  date: "2024.03.10", 
                  title: "새가족 교육 수료식", 
                  tag: "교육",
                  img: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
                },
              ].map((post, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6">
                    <img 
                      src={post.img} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-background text-accent text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                      {post.tag}
                    </span>
                    <span className="text-xs text-on-surface/40 font-medium">{post.date}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 px-6 bg-primary text-white">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-8">찾아오시는 길</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1 uppercase tracking-widest">Address</p>
                    <p className="text-lg">경기도 광명시 광명로 948 (광명동)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1 uppercase tracking-widest">Phone</p>
                    <p className="text-lg">02-2612-0691</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={24} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1 uppercase tracking-widest">Office Hours</p>
                    <p className="text-lg">화 - 토 | 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4">
                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                  <Instagram size={20} />
                </button>
                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                  <Youtube size={20} />
                </button>
                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-primary transition-all">
                  <Facebook size={20} />
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-3xl p-2 backdrop-blur-sm border border-white/10 min-h-[400px] overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3166.123456789!2d126.8546523!3d37.4822554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357b6192f1a6c9d7%3A0x8888888888888888!2z6rSR66qF6rWQ7ZqM!5e0!3m2!1sko!2skr!4v1712640000000!5m2!1sko!2skr" 
                className="w-full h-full min-h-[400px] rounded-2xl border-0"
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="광명교회 지도"
              ></iframe>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface py-12 px-6 border-t border-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-serif text-sm font-bold">
              光
            </div>
            <span className="text-lg font-serif font-bold text-primary">
              광명교회
            </span>
          </div>
          <p className="text-on-surface/40 text-sm">
            © 2024 광명교회. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-on-surface/40 hover:text-primary transition-colors">개인정보처리방침</a>
            <a href="#" className="text-xs text-on-surface/40 hover:text-primary transition-colors">이용약관</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
