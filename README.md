# 📘 KI Tutor Projekt

KI Tutor ist ein Full-Stack-System mit KI-Unterstützung, bestehend aus einem Python-Backend, einem KI-Agenten-Modul sowie einem Docker-basierten Frontend.

---

# 📁 Projektstruktur

```text
project/
│
├── backend/
│   └── main/
│
├── ki_agents/
│   ├── agents/
│   ├── data/
│   ├── app/
│   └── models/
│
├── requirements.txt
│
└── frontend/ (Dockerisiert)
```

---

# ⚙️ Backend Einrichtung

## 📌 Schritt 1: Virtuelle Umgebung erstellen (Erforderlich)

Vor der Installation der Abhängigkeiten sollte eine virtuelle Umgebung erstellt werden.

```bash
python -m venv venv
```

---

## ▶️ Schritt 2: Virtuelle Umgebung aktivieren

### Windows

```bash
venv\Scripts\activate
```

### macOS / Linux

```bash
source venv/bin/activate
```

---

## 📥 Schritt 3: Abhängigkeiten installieren

```bash
pip install -r requirements.txt
```

---

## ▶️ Schritt 4: Backend starten

```bash
cd backend
uvicorn main:app --reload
```

---

## 🌐 Backend URL

```text
http://localhost:8000
```

---

# 🤖 KI-Agenten Modul

Das KI-System befindet sich im Verzeichnis:

```text
ki_agents/
```

## Struktur

* `agents/` → Kernlogik der KI-Agenten
* `data/` → Wissensbasis und Datensätze
* `app/` → Integrationsschicht der Anwendung
* `models/` → KI-/ML-Modelle

> Das Agenten-Modul wird vom Backend genutzt, um KI-Funktionen bereitzustellen.

---

# 🐳 Frontend Einrichtung (Docker)

Das Frontend ist containerisiert und auf Docker Hub verfügbar:

```text
azzeddine24/ki_tutor_front
```

---

## 📥 Schritt 1: Docker Image herunterladen

```bash
docker pull azzeddine24/ki_tutor_front
```

---

## 🚀 Schritt 2: Container starten

```bash
docker run -d -p 8080:80 azzeddine24/ki_tutor_front
```
---

## 🌐 Frontend URL

```text
http://localhost:8080
```

---

# 🔗 Systemübersicht

| Komponente | URL                                            |
| ---------- | ---------------------------------------------- |
| Backend    | [http://localhost:8000](http://localhost:8000) |
| Frontend   | [http://localhost:8080](http://localhost:8080) |

---

# 🧠 Wichtige Hinweise

* Die virtuelle Umgebung sollte immer aktiviert werden, bevor das Backend gestartet wird.
* Das Backend muss laufen, bevor das Frontend verwendet werden kann.
* Docker muss installiert sein, um das Frontend auszuführen.
* Die KI-Agenten müssen korrekt in die Backend-Module integriert sein.

---

# 🚀 Schnellstart

```bash
# Virtuelle Umgebung erstellen
python -m venv venv

# Virtuelle Umgebung aktivieren
source venv/bin/activate   # Windows: venv\Scripts\activate

# Abhängigkeiten installieren
pip install -r requirements.txt

# Backend starten
cd backend/main
uvicorn main:app --reload --port 8000

# Frontend starten
docker run -d -p 8080:80 azzeddine24/ki_tutor_front
```

---

# 📌 Autor

Entwickelt für das KI Tutor System 🚀
