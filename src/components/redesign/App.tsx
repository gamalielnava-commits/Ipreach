"use client";
import React from "react";
import { useIsMobile } from "@/lib/use-is-mobile";
import { Sidebar, Screen } from "./shell";
import { CONVERSATIONS } from "./data";
import { EstudioScreen } from "./screen-estudio";
import { BibliotecaScreen } from "./screen-biblioteca";
import { SermonScreen } from "./screen-sermon";
import { SeriesScreen } from "./screen-series";
import { PlanificadorScreen } from "./screen-planificador";
import { MovilScreen } from "./screen-movil";
import { MarcaScreen } from "./screen-marca";
import { FiltersRail } from "./screen-filtros";
import { OnboardingModal } from "./screen-onboarding";
import { LoginScreen } from "./screen-login";
import { PresenterScreen } from "./screen-presenter";
import { PrintScreen } from "./screen-print";
import { MobileShell } from "./mobile-shell";
import { PerfilScreen } from "./screen-perfil";
import { PlanesScreen } from "./screen-planes";
import { getProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/lib/types";

import type { SermonConfig } from "@/lib/types";
import { listConversations } from "@/lib/chat";

export default function App() {
  const isMobile = useIsMobile();
  const [screen, setScreen] = React.useState<Screen>("estudio");
  const [activeConv, setActiveConv] = React.useState("c1");
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [presenterOpen, setPresenterOpen] = React.useState(false);
  const [printOpen, setPrintOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  
  const [activeSermonId, setActiveSermonId] = React.useState<string | null>(null);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [config, setConfig] = React.useState<SermonConfig>({
    contentType: "sermon",
    idea: "",
    scripture: "",
    framework: "Bautista",
    doctrinalThemes: [],
    themes: ["Fe", "Temor"],
    occasion: "Servicio dominical",
    sermonTypes: ["Expositivo"],
    strategy: "Idea central (Robinson)",
    method: "robinson",
    commentators: ["Tim Keller"],
    illustrationKinds: [],
    length: "medio",
    verseOption: "solo-cita",
    provider: "claude",
  });

  const loadConversations = React.useCallback(async () => {
    try {
      const list = await listConversations();
      setConversations(list);
      if (list.length > 0 && activeConv === "c1") {
        setActiveConv(list[0].id);
      }
    } catch (err) {
      console.error("Error cargando conversaciones:", err);
    }
  }, [activeConv]);

  React.useEffect(() => {
    if (profile) {
      loadConversations();
    }
  }, [profile, loadConversations]);

  React.useEffect(() => {
    document.documentElement.dataset.palette = "capilla";
    document.documentElement.style.setProperty("--font-display", '"Newsreader", Georgia, serif');
    document.documentElement.style.setProperty("--font-body", '"Newsreader", Georgia, serif');
    document.documentElement.style.setProperty("--font-ui", '"Geist", ui-sans-serif, system-ui, sans-serif');
    document.body.style.fontSize = "15px";
  }, []);

  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setLoginOpen(false);
        const p = await getProfile();
        if (p) {
          setProfile(p);
          if (!p.onboarded) setOnboardingOpen(true);
        } else {
          setOnboardingOpen(true);
        }
      } else {
        setProfile(null);
        setConversations([]);
        setLoginOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "1") { e.preventDefault(); setScreen("estudio"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "2") { e.preventDefault(); setScreen("biblioteca"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "3") { e.preventDefault(); setScreen("sermon"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "4") { e.preventDefault(); setScreen("series"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "5") { e.preventDefault(); setScreen("planificador"); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (isMobile) {
    return (
      <>
        <MobileShell
          screen={screen}
          setScreen={setScreen}
          onOpenFilters={() => setFiltersOpen(true)}
        />
        <FiltersRail open={filtersOpen} onClose={() => setFiltersOpen(false)} config={config} setConfig={setConfig} />
      </>
    );
  }

  return (
    <div className="app" data-screen-label={screen}>
      <Sidebar
        screen={screen}
        setScreen={setScreen}
        conversations={conversations}
        activeConv={activeConv}
        setActiveConv={setActiveConv}
        profile={profile}
      />
      {screen === "estudio" && (
        <EstudioScreen
          activeConvId={activeConv && activeConv !== "c1" ? activeConv : null}
          setActiveConvId={setActiveConv}
          onOpenSermon={(sermonId) => {
            setActiveSermonId(sermonId);
            setScreen("sermon");
          }}
          onOpenFilters={() => setFiltersOpen(true)}
          config={config}
          onRefreshConvs={loadConversations}
        />
      )}
      {screen === "biblioteca" && (
        <BibliotecaScreen
          onOpenSermon={(sermonId) => {
            setActiveSermonId(sermonId);
            setScreen("sermon");
          }}
        />
      )}
      {screen === "sermon" && (
        <SermonScreen
          sermonId={activeSermonId}
          onOpenFilters={() => setFiltersOpen(true)}
          onPresent={() => setPresenterOpen(true)}
          onPrint={() => setPrintOpen(true)}
        />
      )}
      {screen === "series" && <SeriesScreen onOpenSermon={() => setScreen("sermon")} />}
      {screen === "planificador" && <PlanificadorScreen />}
      {screen === "movil" && <MovilScreen />}
      {screen === "marca" && <MarcaScreen />}
      {screen === "perfil" && <PerfilScreen onBack={() => setScreen("estudio")} onProfileSaved={setProfile} />}
      {screen === "planes" && <PlanesScreen profile={profile} />}

      <FiltersRail open={filtersOpen} onClose={() => setFiltersOpen(false)} config={config} setConfig={setConfig} />
      <OnboardingModal open={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      {loginOpen && <LoginScreen onSignIn={() => setLoginOpen(false)} />}
      {presenterOpen && <PresenterScreen onClose={() => setPresenterOpen(false)} />}
      {printOpen && <PrintScreen onClose={() => setPrintOpen(false)} />}
    </div>
  );
}
