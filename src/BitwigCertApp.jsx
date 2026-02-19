import { useState, useEffect, useCallback, useRef } from "react";

const CATEGORIES = {
  CORE: "Core DAW & Navigation",
  ARRANGEMENT: "Arrangement & Editing",
  MIXING: "Mixing & Audio Engine",
  INSTRUMENTS: "Instruments & Synthesis",
  GRID: "The Grid",
  MODULATORS: "Modulators & Modulation",
  NOTE_FX: "Note FX & MIDI",
  CLIP_LAUNCHER: "Clip Launcher & Performance",
  HARDWARE: "Hardware Integration & CV",
  SAMPLING: "Sampling & Audio",
  V6: "Bitwig Studio 6 Features",
  ADVANCED: "Advanced Workflow & Tips",
};

const DIFFICULTY = { EASY: 1, MEDIUM: 2, HARD: 3 };

// 120+ questions covering all certification domains
const ALL_QUESTIONS = [
  // === CORE DAW & NAVIGATION ===
  {
    id: 1, cat: "CORE", diff: DIFFICULTY.EASY,
    q: "What is the default keyboard shortcut to toggle between the Arranger and Clip Launcher views?",
    opts: ["Tab", "Space", "Enter", "Shift+Tab"],
    ans: 0,
    explain: "Tab toggles between Arranger Timeline and Clip Launcher views."
  },
  {
    id: 2, cat: "CORE", diff: DIFFICULTY.EASY,
    q: "Which panel in Bitwig Studio allows you to browse presets, samples, and devices?",
    opts: ["Inspector Panel", "Browser Panel", "Device Panel", "Mixer Panel"],
    ans: 1,
    explain: "The Browser Panel (accessible via the browser button or shortcut) provides access to all content."
  },
  {
    id: 3, cat: "CORE", diff: DIFFICULTY.MEDIUM,
    q: "What does the Inspector Panel display when a clip is selected?",
    opts: [
      "Only clip color settings",
      "Clip properties including position, length, loop settings, and launch behavior",
      "Only audio waveform data",
      "MIDI CC assignments only"
    ],
    ans: 1,
    explain: "The Inspector shows detailed properties of the selected clip including timing, loop, launch quantize, and more."
  },
  {
    id: 4, cat: "CORE", diff: DIFFICULTY.MEDIUM,
    q: "How many track types are available in Bitwig Studio?",
    opts: ["3 (Audio, Instrument, Group)", "4 (Audio, Instrument, Hybrid, Group)", "5 (Audio, Instrument, Hybrid, Group, Effect)", "6 (Audio, Instrument, Hybrid, Group, Effect, Master)"],
    ans: 2,
    explain: "Bitwig offers Audio, Instrument, Hybrid, Group, and Effect (FX) track types."
  },
  {
    id: 5, cat: "CORE", diff: DIFFICULTY.HARD,
    q: "What is the function of the 'Hybrid' track type in Bitwig Studio?",
    opts: [
      "It only processes audio signals",
      "It combines instrument and audio track capabilities, accepting both MIDI/note input and audio recording",
      "It is used exclusively for sidechain routing",
      "It only hosts VST3 plugins"
    ],
    ans: 1,
    explain: "Hybrid tracks accept note input for instruments AND can record audio, combining both track type functionalities."
  },
  {
    id: 6, cat: "CORE", diff: DIFFICULTY.EASY,
    q: "What keyboard shortcut opens the Device Panel for the selected track?",
    opts: ["D", "B", "E", "P"],
    ans: 0,
    explain: "Pressing D toggles the Device Panel (Detail Editor) for the selected track."
  },
  {
    id: 7, cat: "CORE", diff: DIFFICULTY.MEDIUM,
    q: "In Bitwig Studio, what does the 'Sandwich' device container do?",
    opts: [
      "Splits audio into frequency bands",
      "Creates a parallel processing chain with wet/dry mix control",
      "Converts audio to MIDI",
      "Creates a feedback loop"
    ],
    ans: 1,
    explain: "The Sandwich container allows you to insert a chain of effects within a parallel split, enabling NY-style compression and similar techniques."
  },
  {
    id: 8, cat: "CORE", diff: DIFFICULTY.HARD,
    q: "What is the maximum number of nested device containers Bitwig Studio supports?",
    opts: ["4 levels", "8 levels", "16 levels", "Unlimited nesting"],
    ans: 3,
    explain: "Bitwig's unified device system allows unlimited nesting of containers within containers."
  },

  // === ARRANGEMENT & EDITING ===
  {
    id: 9, cat: "ARRANGEMENT", diff: DIFFICULTY.EASY,
    q: "How do you split a clip at the playhead position?",
    opts: ["Ctrl/Cmd + X", "Alt + Click", "S (with clip selected)", "Ctrl/Cmd + S"],
    ans: 2,
    explain: "With a clip selected, pressing S splits the clip at the current playhead position."
  },
  {
    id: 10, cat: "ARRANGEMENT", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Bounce' function do in Bitwig Studio?",
    opts: [
      "Exports the entire project",
      "Renders the selected clip or time range in place, including all processing",
      "Creates a backup of the project",
      "Consolidates all tracks into one"
    ],
    ans: 1,
    explain: "Bounce renders the selection in place, freezing all device processing into a new audio clip."
  },
  {
    id: 11, cat: "ARRANGEMENT", diff: DIFFICULTY.MEDIUM,
    q: "What is the difference between 'Bounce' and 'Bounce in Place' in Bitwig?",
    opts: [
      "There is no difference",
      "Bounce creates a new track; Bounce in Place replaces the content on the same track",
      "Bounce exports to disk; Bounce in Place renders in the arrangement",
      "Bounce is for audio; Bounce in Place is for MIDI"
    ],
    ans: 1,
    explain: "Bounce creates a new audio track with the rendered content, while Bounce in Place replaces the original content on the same track."
  },
  {
    id: 12, cat: "ARRANGEMENT", diff: DIFFICULTY.HARD,
    q: "When comping audio takes in Bitwig, what does Alt-clicking on a take lane do?",
    opts: [
      "Deletes the take",
      "Mutes the take",
      "Promotes that section of the take to the main comp",
      "Duplicates the take"
    ],
    ans: 2,
    explain: "Alt-clicking in a take lane promotes that portion to the main comp layer."
  },
  {
    id: 13, cat: "ARRANGEMENT", diff: DIFFICULTY.EASY,
    q: "What is the shortcut to duplicate a selected clip?",
    opts: ["Ctrl/Cmd + D", "Ctrl/Cmd + C", "Shift + D", "Alt + D"],
    ans: 0,
    explain: "Ctrl/Cmd + D duplicates the selected clip(s) in the arrangement."
  },

  // === MIXING & AUDIO ENGINE ===
  {
    id: 14, cat: "MIXING", diff: DIFFICULTY.EASY,
    q: "What is Bitwig Studio's audio engine architecture?",
    opts: [
      "Single-threaded processing",
      "Multi-core, multi-threaded with per-track sandboxing",
      "GPU-accelerated processing",
      "Cloud-based processing"
    ],
    ans: 1,
    explain: "Bitwig uses a multi-core engine with plugin sandboxing — if a plugin crashes, only that plugin is affected, not the entire project."
  },
  {
    id: 15, cat: "MIXING", diff: DIFFICULTY.MEDIUM,
    q: "How does Bitwig Studio handle plugin crashes differently from most other DAWs?",
    opts: [
      "It doesn't — plugins crash the whole DAW",
      "Each plugin runs in a sandboxed process; a crash only affects that plugin",
      "It uses a cloud backup to restore state",
      "It automatically removes the crashed plugin"
    ],
    ans: 1,
    explain: "Bitwig's plugin sandboxing isolates each plugin in its own process, so a crash doesn't take down the DAW."
  },
  {
    id: 16, cat: "MIXING", diff: DIFFICULTY.MEDIUM,
    q: "What is the purpose of the 'Pre' and 'Post' fader buttons on effect devices in the mixer?",
    opts: [
      "They control stereo panning",
      "They determine whether the effect is processed before or after the channel fader",
      "They switch between mono and stereo",
      "They control sidechain input"
    ],
    ans: 1,
    explain: "Pre/Post determines the effect's position relative to the channel fader in the signal flow."
  },
  {
    id: 17, cat: "MIXING", diff: DIFFICULTY.HARD,
    q: "In Bitwig's signal flow, what is the correct order of processing within a single track?",
    opts: [
      "Input → Devices → Fader → Pan → Output",
      "Input → Fader → Devices → Pan → Output",
      "Input → Note FX → Instrument → Audio FX → Fader → Pan → Sends → Output",
      "Input → Pan → Fader → Devices → Output"
    ],
    ans: 2,
    explain: "The full signal chain: Input → Note FX → Instrument → Audio FX chain → Channel Fader → Pan → Sends → Output routing."
  },
  {
    id: 18, cat: "MIXING", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'DC Offset Filter' option in Bitwig's audio settings do?",
    opts: [
      "Removes high-frequency noise",
      "Removes any DC bias from the audio signal to prevent speaker damage and improve headroom",
      "Adjusts sample rate conversion",
      "Enables dithering"
    ],
    ans: 1,
    explain: "DC offset filtering removes any constant voltage bias that can eat headroom and cause clicks during editing."
  },

  // === INSTRUMENTS & SYNTHESIS ===
  {
    id: 19, cat: "INSTRUMENTS", diff: DIFFICULTY.EASY,
    q: "Which Bitwig instrument uses phase distortion and phase modulation synthesis?",
    opts: ["Polymer", "Phase-4", "Polysynth", "FM-4"],
    ans: 1,
    explain: "Phase-4 is Bitwig's four-oscillator phase distortion/modulation synthesizer."
  },
  {
    id: 20, cat: "INSTRUMENTS", diff: DIFFICULTY.MEDIUM,
    q: "What makes the Polymer synthesizer unique compared to other Bitwig instruments?",
    opts: [
      "It's sample-based only",
      "It's a hybrid modular synth that lets you swap individual components (oscillators, filters, shapers) from a library of modules",
      "It only produces sine waves",
      "It's the only instrument that supports MPE"
    ],
    ans: 1,
    explain: "Polymer is a hybrid modular synth where each component (oscillator, filter, etc.) can be swapped for different module types."
  },
  {
    id: 21, cat: "INSTRUMENTS", diff: DIFFICULTY.HARD,
    q: "How many oscillator types are available in Phase-4's oscillator section?",
    opts: ["4", "8", "12", "Phase-4 has 4 oscillators, each with the same waveform options but independent phase modulation routing"],
    ans: 3,
    explain: "Phase-4 has 4 identical oscillators that can modulate each other's phase in various routing configurations."
  },
  {
    id: 22, cat: "INSTRUMENTS", diff: DIFFICULTY.MEDIUM,
    q: "Which Bitwig instrument is specifically designed for drum synthesis with individual voice processing?",
    opts: ["Drum Machine", "E-Kick", "Both E-Kick, E-Snare, E-Clap, E-Hat are individual drum synth devices", "Polysynth"],
    ans: 2,
    explain: "Bitwig provides individual drum synthesis devices (E-Kick, E-Snare, E-Clap, E-Hat) that can be loaded into a Drum Machine."
  },
  {
    id: 23, cat: "INSTRUMENTS", diff: DIFFICULTY.EASY,
    q: "What type of synthesis does the Bitwig 'Organ' device primarily use?",
    opts: ["Subtractive", "Additive (drawbar-based)", "FM synthesis", "Granular"],
    ans: 1,
    explain: "The Organ device uses additive synthesis via drawbars, similar to a classic Hammond tonewheel organ."
  },
  {
    id: 24, cat: "INSTRUMENTS", diff: DIFFICULTY.HARD,
    q: "In Polymer, what happens when you enable the 'Stack' voice mode with a count of 4?",
    opts: [
      "It creates 4 separate MIDI channels",
      "Each note triggers 4 voices simultaneously, each with independent detune/pan spread capabilities",
      "It limits polyphony to 4 notes",
      "It creates 4 parallel effect chains"
    ],
    ans: 1,
    explain: "Voice stacking layers multiple voices per note, allowing unison-style thickening with detune, pan, and other per-voice variations."
  },

  // === THE GRID ===
  {
    id: 25, cat: "GRID", diff: DIFFICULTY.EASY,
    q: "What are the three Grid device types in Bitwig Studio?",
    opts: [
      "Mono Grid, Stereo Grid, Surround Grid",
      "Poly Grid, Mono Grid, FX Grid",
      "Audio Grid, MIDI Grid, CV Grid",
      "Synth Grid, FX Grid, Mod Grid"
    ],
    ans: 1,
    explain: "Poly Grid (polyphonic instrument), Mono Grid (monophonic instrument), and FX Grid (audio effect) are the three Grid types."
  },
  {
    id: 26, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "What is the fundamental difference between Poly Grid and Mono Grid?",
    opts: [
      "Poly Grid has more modules available",
      "Poly Grid allocates a separate instance of the entire patch per voice; Mono Grid processes everything as a single voice",
      "Mono Grid can only play one note at a time",
      "There is no functional difference"
    ],
    ans: 1,
    explain: "Poly Grid creates independent signal paths per voice (true polyphony), while Mono Grid has one shared signal path."
  },
  {
    id: 27, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "In The Grid, what does the 'Pitch' input on an oscillator module expect?",
    opts: [
      "A frequency in Hz",
      "A MIDI note number 0-127",
      "A signal where 0V = C3, with 1V per octave (1V/oct standard)",
      "A value from 0 to 1"
    ],
    ans: 2,
    explain: "The Grid uses a 1V/oct pitch standard where 0 corresponds to C3, making it directly compatible with modular synthesis conventions."
  },
  {
    id: 28, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "What is the purpose of the 'Merge' module in The Grid?",
    opts: [
      "It combines two audio signals by summing them",
      "It merges two mono signals into a stereo signal",
      "It takes a stereo signal and outputs a mono signal",
      "It combines note signals"
    ],
    ans: 1,
    explain: "The Merge module takes Left and Right mono inputs and outputs a stereo signal."
  },
  {
    id: 29, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "In The Grid, what does the 'Sample & Hold' module do to an incoming signal?",
    opts: [
      "Records audio into a buffer",
      "Captures the input value when triggered and holds that value until the next trigger",
      "Plays back samples from disk",
      "Freezes the entire Grid patch"
    ],
    ans: 1,
    explain: "Sample & Hold captures (samples) the input voltage at the moment of a trigger and holds it constant until the next trigger arrives."
  },
  {
    id: 30, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "What module category contains the 'Bend', 'Quantize', and 'Transpose' modules in The Grid?",
    opts: ["I/O modules", "Pitch modules", "Signal modules", "Logic modules"],
    ans: 1,
    explain: "Pitch modules handle pitch-related operations including bending, quantization to scales, and transposition."
  },
  {
    id: 31, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "In The Grid, how does the 'Follower' module differ from the 'Audio Sidechain' module?",
    opts: [
      "There is no difference",
      "Follower extracts the amplitude envelope of its input signal; Audio Sidechain brings in audio from another track",
      "Follower is for MIDI; Audio Sidechain is for audio",
      "Audio Sidechain has a built-in compressor"
    ],
    ans: 1,
    explain: "Follower converts an audio signal to its amplitude envelope (like an envelope follower). Audio Sidechain receives audio from external tracks."
  },
  {
    id: 32, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'Zero Crossing' module used for in The Grid?",
    opts: [
      "Fading audio to zero",
      "Detecting when a signal crosses zero, outputting a trigger at each crossing",
      "Setting the DC offset to zero",
      "Resetting all modules"
    ],
    ans: 1,
    explain: "Zero Crossing detects when a signal passes through zero, useful for triggering events at audio rate or creating sync signals."
  },
  {
    id: 33, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "When building a wavetable-style oscillator in The Grid, which approach is most effective?",
    opts: [
      "Use multiple oscillator modules and crossfade between them",
      "Use a single oscillator with a wavefolder",
      "Use the Swarm oscillator with morph control",
      "Import a wavetable file into the Sampler module"
    ],
    ans: 0,
    explain: "Crossfading between multiple oscillators with different waveforms is the Grid-native approach to wavetable-style synthesis."
  },

  // === MODULATORS & MODULATION ===
  {
    id: 34, cat: "MODULATORS", diff: DIFFICULTY.EASY,
    q: "How do you assign a modulator to a parameter in Bitwig Studio?",
    opts: [
      "Right-click the parameter and select 'Add Modulator'",
      "Click the modulator's output dot and drag it to any modulatable parameter",
      "Use the MIDI Learn function",
      "Modulators can only be assigned in the Grid"
    ],
    ans: 1,
    explain: "Drag from the modulator's output indicator to any blue-highlighted modulatable parameter."
  },
  {
    id: 35, cat: "MODULATORS", diff: DIFFICULTY.MEDIUM,
    q: "What is 'Unified Modulation' in Bitwig Studio?",
    opts: [
      "A modulation routing limited to instruments only",
      "The ability to modulate virtually ANY parameter on ANY device at ANY level of the device chain",
      "A single LFO that controls everything",
      "A modulation bus similar to aux sends"
    ],
    ans: 1,
    explain: "Bitwig's Unified Modulation system allows modulators to target parameters on any device anywhere in the chain, even nested containers."
  },
  {
    id: 36, cat: "MODULATORS", diff: DIFFICULTY.MEDIUM,
    q: "Which modulator would you use to create a ducking effect triggered by another track's audio?",
    opts: ["LFO", "Audio Sidechain modulator", "Envelope Follower", "Steps modulator"],
    ans: 1,
    explain: "The Audio Sidechain modulator receives audio from another track and converts it to a modulation signal, perfect for sidechain ducking."
  },
  {
    id: 37, cat: "MODULATORS", diff: DIFFICULTY.HARD,
    q: "What is the difference between 'Absolute' and 'Relative' modulation modes in Bitwig?",
    opts: [
      "Absolute replaces the parameter value; Relative adds/subtracts from the current value",
      "Absolute is bipolar; Relative is unipolar",
      "Absolute works with audio; Relative works with MIDI",
      "There is no such distinction"
    ],
    ans: 0,
    explain: "Absolute modulation sets the parameter to the modulator's value. Relative modulation adds or subtracts from the parameter's current position."
  },
  {
    id: 38, cat: "MODULATORS", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Expressions' modulator allow you to modulate with?",
    opts: [
      "Only velocity",
      "MPE dimensions: Pressure, Slide (Y-axis), Timbre, and per-note Pitch Bend",
      "Only aftertouch",
      "Only pitch bend"
    ],
    ans: 1,
    explain: "The Expressions modulator maps MPE expression dimensions (pressure, slide, timbre, per-note pitch) to modulation targets."
  },
  {
    id: 39, cat: "MODULATORS", diff: DIFFICULTY.HARD,
    q: "How does the 'Segments' modulator (MSEG) differ from a standard multi-stage envelope?",
    opts: [
      "It can only have 4 segments",
      "It's a freely drawable multi-segment envelope with per-point curve shapes, looping, and sync options",
      "It only works in The Grid",
      "It's identical to a standard ADSR"
    ],
    ans: 1,
    explain: "Segments is a fully customizable MSEG (Multi-Segment Envelope Generator) with arbitrary points, curves, loops, and tempo sync."
  },

  // === NOTE FX & MIDI ===
  {
    id: 40, cat: "NOTE_FX", diff: DIFFICULTY.EASY,
    q: "Where do Note FX devices appear in the Bitwig device chain?",
    opts: [
      "After the instrument",
      "Before the instrument, processing MIDI/note data before it reaches the sound generator",
      "In a separate Note FX panel",
      "Only in the Clip Launcher"
    ],
    ans: 1,
    explain: "Note FX sit before the instrument in the device chain, transforming note data before sound generation."
  },
  {
    id: 41, cat: "NOTE_FX", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Diatonic Transposer' Note FX do?",
    opts: [
      "Transposes notes by semitones",
      "Transposes notes by scale degrees within a specified key and scale, maintaining musical relationships",
      "Converts polyphonic input to monophonic",
      "Randomizes note pitches"
    ],
    ans: 1,
    explain: "Diatonic Transposer shifts notes by scale degrees, keeping everything in key — different from chromatic transposition."
  },
  {
    id: 42, cat: "NOTE_FX", diff: DIFFICULTY.HARD,
    q: "How can you chain multiple Note FX devices in Bitwig?",
    opts: [
      "You can only use one Note FX per track",
      "Add them sequentially before the instrument — they process in series from left to right",
      "They must be placed in a Note FX container",
      "Note FX cannot be chained"
    ],
    ans: 1,
    explain: "Multiple Note FX can be chained in series before the instrument, each processing the output of the previous one."
  },
  {
    id: 43, cat: "NOTE_FX", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Multi-Note' Note FX device do?",
    opts: [
      "Splits notes across multiple tracks",
      "Generates additional notes at specified intervals from each incoming note, creating chords",
      "Converts chords to single notes",
      "Records multiple takes"
    ],
    ans: 1,
    explain: "Multi-Note adds harmonizing notes at configurable intervals, turning single notes into chords."
  },
  {
    id: 44, cat: "NOTE_FX", diff: DIFFICULTY.HARD,
    q: "What is the 'Note Receiver' device used for in Bitwig?",
    opts: [
      "Recording MIDI from external hardware",
      "Receiving note data from other tracks, enabling layered instrument routing without duplicating MIDI data",
      "Converting audio to MIDI notes",
      "Monitoring incoming MIDI data"
    ],
    ans: 1,
    explain: "Note Receiver lets one track's instrument respond to notes from another track, enabling layered sounds without MIDI duplication."
  },

  // === CLIP LAUNCHER & PERFORMANCE ===
  {
    id: 45, cat: "CLIP_LAUNCHER", diff: DIFFICULTY.EASY,
    q: "What is the primary purpose of the Clip Launcher in Bitwig Studio?",
    opts: [
      "File management",
      "Non-linear triggering and performance of clips in a grid/scene-based workflow",
      "Plugin management",
      "Audio recording only"
    ],
    ans: 1,
    explain: "The Clip Launcher enables non-linear, scene-based triggering of clips — similar to Ableton's Session View but with unique Bitwig features."
  },
  {
    id: 46, cat: "CLIP_LAUNCHER", diff: DIFFICULTY.MEDIUM,
    q: "What does 'Launch Quantize' control in the Clip Launcher?",
    opts: [
      "The pitch quantization of notes",
      "When a triggered clip actually starts playing, snapped to a musical time division",
      "The volume of clip playback",
      "The BPM of the clip"
    ],
    ans: 1,
    explain: "Launch Quantize determines the next musical boundary at which a triggered clip will begin (e.g., next bar, next beat)."
  },
  {
    id: 47, cat: "CLIP_LAUNCHER", diff: DIFFICULTY.HARD,
    q: "What are 'Scenes' in the Clip Launcher and how are they triggered?",
    opts: [
      "Scenes are visual themes for the UI",
      "Scenes are horizontal rows that trigger all clips in that row simultaneously, creating song sections",
      "Scenes are saved project states",
      "Scenes are automation snapshots"
    ],
    ans: 1,
    explain: "Scenes represent horizontal rows in the Clip Launcher. Triggering a scene launches all clips in that row simultaneously."
  },
  {
    id: 48, cat: "CLIP_LAUNCHER", diff: DIFFICULTY.MEDIUM,
    q: "How do you move a clip from the Clip Launcher to the Arranger timeline?",
    opts: [
      "Copy and paste only",
      "Drag the clip directly from the Launcher to the desired position in the Arranger",
      "Export and re-import",
      "This is not possible"
    ],
    ans: 1,
    explain: "You can directly drag clips between the Clip Launcher and Arranger in either direction."
  },
  {
    id: 49, cat: "CLIP_LAUNCHER", diff: DIFFICULTY.HARD,
    q: "What does the 'Follow Action' feature do in Bitwig's Clip Launcher?",
    opts: [
      "Automatically follows the selected track",
      "Defines what happens after a clip finishes playing — trigger next clip, random clip, return, etc.",
      "Follows the master tempo",
      "Automatically follows scene changes"
    ],
    ans: 1,
    explain: "Follow Actions automate clip progression in the Launcher — after a clip plays, it can trigger the next, previous, random, or specific clip."
  },

  // === HARDWARE INTEGRATION & CV ===
  {
    id: 50, cat: "HARDWARE", diff: DIFFICULTY.EASY,
    q: "Which Bitwig device is used to send CV/Gate signals to external hardware synthesizers?",
    opts: ["MIDI Out", "HW CV Out", "Audio Receiver", "Note Transmitter"],
    ans: 1,
    explain: "HW CV Out sends control voltage and gate signals through a compatible audio interface (like the ES-8) to control modular gear."
  },
  {
    id: 51, cat: "HARDWARE", diff: DIFFICULTY.MEDIUM,
    q: "What type of audio interface is required to send CV from Bitwig to modular hardware?",
    opts: [
      "Any USB audio interface",
      "A DC-coupled audio interface (like Expert Sleepers ES-8) that can output true DC voltage",
      "A MIDI interface only",
      "A Bluetooth audio adapter"
    ],
    ans: 1,
    explain: "DC-coupled interfaces like the ES-8 can output steady voltage levels needed for CV control, unlike AC-coupled interfaces."
  },
  {
    id: 52, cat: "HARDWARE", diff: DIFFICULTY.HARD,
    q: "In Bitwig's HW CV Out device, what voltage range does the pitch CV output typically use?",
    opts: [
      "0-5V with Hz/V standard",
      "0-10V with 1V/oct standard, where each volt represents one octave",
      "-5V to +5V with 1V/oct",
      "Only MIDI values, not actual voltage"
    ],
    ans: 2,
    explain: "Bitwig outputs bipolar (-5V to +5V) 1V/oct pitch CV, covering a wide range compatible with Eurorack standards."
  },
  {
    id: 53, cat: "HARDWARE", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'HW Clock Out' device do in Bitwig?",
    opts: [
      "Displays the current time",
      "Sends clock/sync pulses through audio outputs to synchronize external hardware with Bitwig's tempo",
      "Sets project tempo",
      "Calculates latency compensation"
    ],
    ans: 1,
    explain: "HW Clock Out generates analog clock pulses synced to Bitwig's transport, for syncing drum machines, sequencers, and modular clocks."
  },
  {
    id: 54, cat: "HARDWARE", diff: DIFFICULTY.HARD,
    q: "How does Bitwig handle round-trip latency compensation when using HW CV Out with external hardware?",
    opts: [
      "It doesn't — you must manually compensate",
      "Automatic detection via test tone",
      "You set the expected latency in the HW Instrument device wrapper, and Bitwig compensates accordingly in the timeline",
      "It uses sidechain detection"
    ],
    ans: 2,
    explain: "The HW Instrument device wrapper has a latency setting; once configured, Bitwig offsets the track to maintain timing alignment."
  },

  // === SAMPLING & AUDIO ===
  {
    id: 55, cat: "SAMPLING", diff: DIFFICULTY.EASY,
    q: "What time-stretching algorithms does the Bitwig Sampler offer?",
    opts: [
      "Élastique only",
      "Repitch, Cycles, Stretch, and Textures (granular)",
      "Time compression only",
      "No time-stretching capability"
    ],
    ans: 1,
    explain: "Bitwig's Sampler offers Repitch, Cycles, Stretch, and the granular Textures mode for various time-stretching approaches."
  },
  {
    id: 56, cat: "SAMPLING", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Textures' mode in the Bitwig Sampler do?",
    opts: [
      "Applies a texture overlay to the waveform display",
      "A granular playback mode that breaks audio into grains, controlling grain size, spray, and motion",
      "Imports texture maps for visual synthesis",
      "Adds noise to the sample"
    ],
    ans: 1,
    explain: "Textures mode is a granular engine with grain size, spray (randomization), and motion parameters for creative sound design."
  },
  {
    id: 57, cat: "SAMPLING", diff: DIFFICULTY.HARD,
    q: "In the Bitwig Sampler's Textures mode, what does the 'Spray' parameter control?",
    opts: [
      "The volume of grains",
      "The randomization of grain playback position, creating scattered/diffused textures",
      "The panning spread",
      "The pitch randomization"
    ],
    ans: 1,
    explain: "Spray randomizes where grains are sourced from relative to the playhead, creating more diffused and textured results."
  },
  {
    id: 58, cat: "SAMPLING", diff: DIFFICULTY.MEDIUM,
    q: "What is a 'Multisample' in Bitwig and how is it created?",
    opts: [
      "A collection of samples mapped across the keyboard with velocity zones",
      "Multiple copies of the same sample",
      "A stereo sample",
      "A sample with multiple effects"
    ],
    ans: 0,
    explain: "A Multisample maps different samples across keyboard zones and velocity layers, essential for realistic instrument sampling."
  },

  // === BITWIG STUDIO 6 FEATURES ===
  {
    id: 59, cat: "V6", diff: DIFFICULTY.EASY,
    q: "What major new type of clip was introduced in Bitwig Studio 6?",
    opts: ["Video clips", "Automation clips", "Sidechain clips", "Group clips"],
    ans: 1,
    explain: "Bitwig 6 introduces Automation Clips — self-contained automation data that can be looped, stretched, and saved like audio/note clips."
  },
  {
    id: 60, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "What are 'Clip Aliases' in Bitwig Studio 6?",
    opts: [
      "Renamed copies of clips",
      "Specialized duplicates that share the same pattern — editing one updates all aliases",
      "Keyboard shortcuts for clip operations",
      "Color-coded clip categories"
    ],
    ans: 1,
    explain: "Clip Aliases reference a shared Pattern. Edit any alias and all others referencing the same Pattern update automatically."
  },
  {
    id: 61, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "What keyboard shortcut activates the new Automation Mode in Bitwig Studio 6?",
    opts: ["M", "A", "Shift+A", "Ctrl+A"],
    ans: 1,
    explain: "Pressing [A] toggles Automation Mode, overlaying automation lanes on the Arranger tracks."
  },
  {
    id: 62, cat: "V6", diff: DIFFICULTY.HARD,
    q: "In Bitwig 6, what does the 'Spread' feature do for automation points?",
    opts: [
      "Distributes points evenly in time",
      "Applies a randomized value range to individual automation points on each playback pass",
      "Creates a stereo spread effect",
      "Expands the automation range to 0-100%"
    ],
    ans: 1,
    explain: "Spread adds controlled randomization — each automation point varies within a set range on every pass, creating organic variation."
  },
  {
    id: 63, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "What new project-wide musical feature did Bitwig Studio 6 introduce?",
    opts: [
      "Project-wide tempo changes",
      "Global key signature with scale awareness across devices and Note FX",
      "Project-wide sidechain routing",
      "Global reverb bus"
    ],
    ans: 1,
    explain: "Bitwig 6 adds a global key signature that Note FX, Grid modules, and other devices can reference for scale-aware processing."
  },
  {
    id: 64, cat: "V6", diff: DIFFICULTY.HARD,
    q: "Which new Grid modules were introduced in Bitwig Studio 6 for working with the global key signature?",
    opts: [
      "Key Track and Scale Track",
      "Scale (Pitch), Scale Steps (Pitch), Root Key (I/O), and Pitch Class (Pitch)",
      "Note Quantize and Note Filter",
      "Chord Generator and Scale Mapper"
    ],
    ans: 1,
    explain: "Four new Grid modules: 'by Scale' corrects pitch to key, 'Scale Steps' shifts by scale degrees, 'Root Key' provides the root note, and 'Pitch Class' is a manual pitch constant."
  },
  {
    id: 65, cat: "V6", diff: DIFFICULTY.EASY,
    q: "What new editing tool was added to Bitwig Studio 6's toolbar?",
    opts: ["Eraser tool", "Spray Can tool", "Magnifying glass", "Rotation tool"],
    ans: 1,
    explain: "The Spray Can tool allows rapid creation of clips or notes by simply dragging across the timeline."
  },
  {
    id: 66, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "In Bitwig 6, what does the 'Hold' behavior for automation points do?",
    opts: [
      "Pauses playback at that point",
      "Maintains a constant value until the next automation point is reached, creating stepped automation",
      "Holds the last played note",
      "Freezes the track"
    ],
    ans: 1,
    explain: "Hold keeps the automation at a flat value until the next point, creating precise step-style automation without curves."
  },
  {
    id: 67, cat: "V6", diff: DIFFICULTY.HARD,
    q: "How do automation clips and BWCURVE files relate in Bitwig Studio 6?",
    opts: [
      "They are completely unrelated formats",
      "The browser offers both together, and dragging an automation clip onto a device loads the shape into a Segments MSEG",
      "BWCURVE files can only be used in The Grid",
      "Automation clips replace BWCURVE files entirely"
    ],
    ans: 1,
    explain: "Automation clips and BWCURVE files share the same curve format. Dragging an automation clip onto a device loads it as a Segments MSEG shape."
  },
  {
    id: 68, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "What does the new Audition tool in Bitwig Studio 6 do?",
    opts: [
      "Adds reverb to preview",
      "Allows direct playback preview of any track or clip from any point without moving the playhead",
      "Records audio from the microphone",
      "Plays back at half speed for analysis"
    ],
    ans: 1,
    explain: "The Audition tool lets you click anywhere to instantly hear that point in a track or clip, without affecting the transport."
  },
  {
    id: 69, cat: "V6", diff: DIFFICULTY.EASY,
    q: "What visual change is immediately apparent in Bitwig Studio 6's interface?",
    opts: [
      "Everything is now light/white themed",
      "The interface has rounded edges and a permanent dark theme",
      "It switched to a blue color scheme",
      "The mixer was removed"
    ],
    ans: 1,
    explain: "Bitwig 6 features a refreshed UI with rounded edges and a permanent dark background — no light theme option."
  },
  {
    id: 70, cat: "V6", diff: DIFFICULTY.HARD,
    q: "In Bitwig Studio 6, what new safety feature helps when opening projects from older versions?",
    opts: [
      "It refuses to open old projects",
      "A permanent backup of the original project file is saved automatically with the version number in the name",
      "It creates a read-only copy",
      "It converts all plugins to native Bitwig devices"
    ],
    ans: 1,
    explain: "When opening a project from a previous version, Bitwig 6 automatically saves a permanent backup of the original file."
  },
  {
    id: 71, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "What is the new 'Key Filter+' device in Bitwig Studio 6?",
    opts: [
      "A keyboard mapping tool",
      "A Note FX that uses the 23 global scales with options to filter, keep, constrain, or solo foreign notes",
      "A MIDI channel filter",
      "An audio frequency filter"
    ],
    ans: 1,
    explain: "Key Filter+ replaces the legacy Key Filter with scale-aware note processing: Filter, Keep, Constrain (with Smart Quantize), or Solo modes."
  },

  // === ADVANCED WORKFLOW ===
  {
    id: 72, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'Project Remote Controls' feature in Bitwig?",
    opts: [
      "A way to control Bitwig from a web browser",
      "User-defined parameter pages that collect important parameters from across the project for quick access and MIDI mapping",
      "Remote desktop access to Bitwig",
      "Cloud project storage controls"
    ],
    ans: 1,
    explain: "Project Remote Controls let you collect any parameters from anywhere in the project onto dedicated pages for quick access and controller mapping."
  },
  {
    id: 73, cat: "ADVANCED", diff: DIFFICULTY.HARD,
    q: "What is 'Operator' mode in Bitwig's Clip Launcher and what does it enable?",
    opts: [
      "It allows complex mathematical operations on audio",
      "It defines conditional rules for clip playback including probability, randomization, and alternation patterns",
      "It enables operator-style FM synthesis",
      "It's an admin mode for multi-user sessions"
    ],
    ans: 1,
    explain: "Operators add conditional logic to clip triggering — probability-based launching, alternation, cycling, and other generative behaviors."
  },
  {
    id: 74, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "How does Bitwig's 'Macro' device differ from a standard knob assignment?",
    opts: [
      "It has a different color",
      "A Macro maps a single control to multiple parameters with independent ranges and curves for each target",
      "It only works with hardware controllers",
      "It can only control volume and pan"
    ],
    ans: 1,
    explain: "Macros allow one knob to control many parameters simultaneously, each with its own range, direction, and curve shape."
  },
  {
    id: 75, cat: "ADVANCED", diff: DIFFICULTY.HARD,
    q: "What does the 'Audio Receiver' device do and why is it powerful for parallel processing?",
    opts: [
      "It records incoming audio",
      "It receives audio from another track's pre-fader output, enabling complex parallel routing without sends",
      "It monitors the master output",
      "It captures external audio inputs"
    ],
    ans: 1,
    explain: "Audio Receiver taps into another track's audio signal, enabling parallel processing chains without traditional send/return routing."
  },
  {
    id: 76, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "What file format does Bitwig use for its native presets?",
    opts: [".bwpreset", ".fxp", ".vstpreset", ".bwp"],
    ans: 0,
    explain: "Bitwig uses .bwpreset files for device presets, which include all parameter states and modulation assignments."
  },
  {
    id: 77, cat: "ADVANCED", diff: DIFFICULTY.HARD,
    q: "What is the maximum number of modulation sources that can target a single parameter in Bitwig?",
    opts: ["1", "4", "8", "Unlimited"],
    ans: 3,
    explain: "Bitwig allows unlimited modulators to target the same parameter — they are summed together."
  },
  {
    id: 78, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "What is the purpose of the 'Note Filter' device in Bitwig's device chain?",
    opts: [
      "It removes audio frequencies",
      "It selectively passes or blocks notes based on pitch range, velocity range, or channel",
      "It filters out duplicate notes",
      "It removes MIDI CC data"
    ],
    ans: 1,
    explain: "Note Filter passes or blocks MIDI notes based on configurable pitch, velocity, and channel criteria."
  },

  // === MORE GRID DEEP DIVES ===
  {
    id: 79, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "In The Grid, what happens when you connect an audio-rate signal to a control-rate input?",
    opts: [
      "It causes an error",
      "The signal is automatically downsampled to control rate",
      "The Grid rejects the connection",
      "The patch becomes silent"
    ],
    ans: 1,
    explain: "The Grid handles rate conversion automatically — audio signals connected to control inputs are downsampled."
  },
  {
    id: 80, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Latch' module do in The Grid?",
    opts: [
      "Latches notes for sustained playback",
      "When triggered, captures and holds the input signal value; a second trigger can release it",
      "Creates a latching toggle switch from any gate input",
      "Locks the Grid patch from editing"
    ],
    ans: 2,
    explain: "Latch converts a momentary gate/trigger into a toggle behavior — first trigger latches on, second trigger releases."
  },
  {
    id: 81, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "How can you create a feedback loop in The Grid without causing instability?",
    opts: [
      "Feedback is not possible in The Grid",
      "Use the 'Long Delay' or 'Short Delay' module in the feedback path — the built-in delay provides the one-sample minimum needed",
      "Connect output directly to input",
      "Use the Feedback module from the utility category"
    ],
    ans: 1,
    explain: "A delay module in the feedback path provides the minimum buffer needed. Direct feedback connections would cause infinite recursion."
  },

  // === MORE INSTRUMENTS ===
  {
    id: 82, cat: "INSTRUMENTS", diff: DIFFICULTY.MEDIUM,
    q: "What synthesis method does the 'FM-4' device in Bitwig use?",
    opts: [
      "Subtractive synthesis",
      "Frequency Modulation synthesis with 4 operators",
      "Granular synthesis",
      "Physical modeling"
    ],
    ans: 1,
    explain: "FM-4 is a 4-operator FM synthesizer with configurable algorithms and modulation routing between operators."
  },
  {
    id: 83, cat: "INSTRUMENTS", diff: DIFFICULTY.HARD,
    q: "What is unique about the 'Replacer' audio FX device?",
    opts: [
      "It replaces one VST with another",
      "It analyzes incoming audio transients and triggers an internal synthesizer or sampler, effectively replacing the original sound",
      "It replaces automation data",
      "It overwrites the source audio file"
    ],
    ans: 1,
    explain: "Replacer detects transients in audio and triggers a built-in synth/sampler — great for layering or completely replacing drum sounds."
  },
  {
    id: 84, cat: "INSTRUMENTS", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Note Grid' device enable that's different from Poly/Mono Grid?",
    opts: [
      "It's a MIDI sequencer Grid",
      "It processes note/MIDI data using Grid modules, functioning as a Note FX built in the Grid environment",
      "It only plays notes from a grid pattern",
      "It converts audio to notes"
    ],
    ans: 1,
    explain: "Note Grid processes MIDI/note data using Grid modules, placing the Grid's modular power into the Note FX position of the chain."
  },

  // === MORE CORE ===
  {
    id: 85, cat: "CORE", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Detail Editor Panel' show when you double-click a note clip?",
    opts: [
      "Only a piano roll",
      "A piano roll with expression editing (velocity, pressure, timbre, pitch), per-note editing, and automation lanes",
      "A text-based note list",
      "A frequency spectrum"
    ],
    ans: 1,
    explain: "The Detail Editor shows a full piano roll with expression lanes, per-note parameter editing, and coincident automation."
  },
  {
    id: 86, cat: "CORE", diff: DIFFICULTY.HARD,
    q: "What is 'MPE' support in Bitwig and how is it configured?",
    opts: [
      "Multi-Protocol Exchange — allows VST2 and VST3 to communicate",
      "MIDI Polyphonic Expression — enabled per-track, allowing per-note pitch bend, pressure, and slide from compatible controllers",
      "Multi-Platform Export — for cross-DAW compatibility",
      "Master Parameter Editing — for batch parameter changes"
    ],
    ans: 1,
    explain: "MPE (MIDI Polyphonic Expression) enables per-note expression data. Bitwig has native MPE support that can be enabled per track."
  },

  // === MORE MIXING ===
  {
    id: 87, cat: "MIXING", diff: DIFFICULTY.HARD,
    q: "What is the purpose of the 'Crossover' container device?",
    opts: [
      "Creates DJ-style crossfade between tracks",
      "Splits audio into frequency bands (up to 4), allowing independent processing of each band",
      "Creates a crossover distortion effect",
      "Blends two audio signals"
    ],
    ans: 1,
    explain: "The Crossover container splits audio into frequency bands with crossover points, enabling multiband processing with any FX."
  },
  {
    id: 88, cat: "MIXING", diff: DIFFICULTY.MEDIUM,
    q: "How do 'Group Tracks' in Bitwig differ from 'Effect Tracks'?",
    opts: [
      "There is no difference",
      "Group tracks contain child tracks and sum their audio; Effect tracks act as send/return destinations",
      "Group tracks are for MIDI; Effect tracks are for audio",
      "Effect tracks can contain child tracks"
    ],
    ans: 1,
    explain: "Group tracks are folders that sum child track audio. Effect (FX) tracks are destinations for send effects."
  },

  // === MORE HARDWARE ===
  {
    id: 89, cat: "HARDWARE", diff: DIFFICULTY.HARD,
    q: "When using HW CV Out with Eurorack, what is the typical gate voltage that Bitwig outputs for note-on events?",
    opts: [
      "1V", "3.3V", "5V (matching Eurorack gate standards)", "10V"
    ],
    ans: 2,
    explain: "Bitwig outputs approximately 5V gates via DC-coupled interfaces, matching the Eurorack standard gate voltage."
  },
  {
    id: 90, cat: "HARDWARE", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'HW Instrument' device wrapper used for in Bitwig?",
    opts: [
      "Loading hardware synth VST models",
      "Wrapping external hardware as a virtual instrument — sending MIDI/CV out and receiving audio back with latency compensation",
      "Monitoring hardware inputs",
      "Converting hardware controls to automation"
    ],
    ans: 1,
    explain: "HW Instrument combines MIDI/CV output and audio input into a single device, with latency compensation for seamless integration."
  },

  // === MORE CLIP LAUNCHER ===
  {
    id: 91, cat: "CLIP_LAUNCHER", diff: DIFFICULTY.HARD,
    q: "In the Clip Launcher, what does the 'Accent' operator do?",
    opts: [
      "Applies an accent effect to the audio",
      "When active, clips triggered while holding Accent will play with boosted velocity",
      "It accents the first beat of each bar",
      "It highlights clips with a border"
    ],
    ans: 1,
    explain: "The Accent function boosts velocity for clips triggered while it's active, useful for live performance emphasis."
  },

  // === MORE NOTE FX ===
  {
    id: 92, cat: "NOTE_FX", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Arpeggiator' Note FX in Bitwig offer that basic arpeggiators don't?",
    opts: [
      "Nothing special",
      "Humanize, shuffle, rate modulation, multiple pattern modes, and octave range with integrated modulation capability",
      "Only up/down patterns",
      "Audio arpeggiation"
    ],
    ans: 1,
    explain: "Bitwig's Arpeggiator includes humanize, shuffle, rate control (modulatable!), multiple modes, and octave range — all with Bitwig's modulation system."
  },

  // === MORE MODULATORS ===
  {
    id: 93, cat: "MODULATORS", diff: DIFFICULTY.HARD,
    q: "What is the 'Button' modulator used for in Bitwig?",
    opts: [
      "Creating on-screen buttons for the UI",
      "A toggleable or momentary modulation source that can be triggered by MIDI, mapped to controllers, or clicked in the GUI",
      "A hardware button input monitor",
      "A macro button for batch operations"
    ],
    ans: 1,
    explain: "The Button modulator provides a simple on/off modulation source — toggleable or momentary, mappable to any controller."
  },
  {
    id: 94, cat: "MODULATORS", diff: DIFFICULTY.MEDIUM,
    q: "How does the 'AHDSR' modulator differ from a basic 'ADSR' envelope?",
    opts: [
      "It adds a Hold stage between Attack and Decay",
      "It has an additional Sustain stage",
      "AHDSR stands for Audio Hold Decay Sustain Release",
      "There is no difference"
    ],
    ans: 0,
    explain: "AHDSR adds a Hold stage after Attack and before Decay, holding at peak level for a specified time before decaying."
  },

  // === MORE SAMPLING ===
  {
    id: 95, cat: "SAMPLING", diff: DIFFICULTY.HARD,
    q: "In the Bitwig Sampler, what does the 'Cycles' time-stretch mode do?",
    opts: [
      "Loops the sample cyclically",
      "Analyzes and preserves individual waveform cycles for pitch-independent time stretching, ideal for sustained sounds",
      "Creates a cycle count",
      "Cycles through different stretch algorithms"
    ],
    ans: 1,
    explain: "Cycles mode preserves individual waveform cycles for clean pitch-independent stretching — works best with sustained, harmonically stable sounds."
  },

  // === MORE ADVANCED ===
  {
    id: 96, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Container' concept mean in Bitwig's device system?",
    opts: [
      "A folder for organizing presets",
      "Devices that hold other devices inside them — Chain, Layer, Drum Machine, Instrument Selector, FX Selector, etc.",
      "A storage format for samples",
      "A project organization feature"
    ],
    ans: 1,
    explain: "Containers (Chain, Layer, Drum Machine, Instrument/FX Selector, etc.) nest devices within devices, enabling complex signal routing."
  },
  {
    id: 97, cat: "ADVANCED", diff: DIFFICULTY.HARD,
    q: "What is the 'Instrument Layer' device and how does it differ from 'Instrument Selector'?",
    opts: [
      "Layer stacks multiple instruments playing simultaneously; Selector switches between them (only one active at a time)",
      "They are identical",
      "Layer is for effects; Selector is for instruments",
      "Selector layers sounds; Layer selects them"
    ],
    ans: 0,
    explain: "Instrument Layer stacks instruments in parallel (all play together). Instrument Selector lets you switch between different instruments."
  },
  {
    id: 98, cat: "ADVANCED", diff: DIFFICULTY.HARD,
    q: "What plugin formats does Bitwig Studio support?",
    opts: [
      "VST2 only",
      "VST2, VST3, and CLAP",
      "VST3 and AU",
      "VST2, VST3, CLAP, and AU (on macOS)"
    ],
    ans: 1,
    explain: "Bitwig supports VST2, VST3, and CLAP. Notably, it does NOT support AU (Audio Units), even on macOS."
  },
  {
    id: 99, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'FX Selector' container device used for?",
    opts: [
      "Selecting which effects are installed",
      "Switching between different effect chain presets — only the selected chain processes audio",
      "Filtering the FX browser results",
      "Selecting between effect types"
    ],
    ans: 1,
    explain: "FX Selector holds multiple effect chains and lets you switch between them — perfect for toggling between different processing setups."
  },
  {
    id: 100, cat: "ADVANCED", diff: DIFFICULTY.HARD,
    q: "What does 'Open Sound Control' (OSC) support in Bitwig enable?",
    opts: [
      "Control over Bluetooth",
      "Network-based parameter control, allowing remote control from other software, tablets, or custom interfaces via OSC protocol",
      "Open-source plugin support",
      "Sound analysis tools"
    ],
    ans: 1,
    explain: "Bitwig's OSC support enables network-based bidirectional control, perfect for custom controllers, TouchOSC, Lemur, etc."
  },

  // === ADDITIONAL QUESTIONS FOR DEPTH ===
  {
    id: 101, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'Swarm' oscillator module in The Grid known for?",
    opts: [
      "Single clean oscillator",
      "A unison oscillator that stacks multiple detuned copies with spread and count controls",
      "A noise generator",
      "A wavetable oscillator"
    ],
    ans: 1,
    explain: "Swarm stacks multiple oscillator voices with detune and stereo spread, creating thick supersaw-style sounds."
  },
  {
    id: 102, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "What does the 'Recorder' module in The Grid do?",
    opts: [
      "Records MIDI",
      "Records audio into a buffer that can then be played back, enabling live looping and sampling within The Grid",
      "Records parameter automation",
      "Records patch configurations"
    ],
    ans: 1,
    explain: "The Recorder module captures audio into a buffer in real-time, enabling Grid-based loopers, freeze effects, and live sampling."
  },
  {
    id: 103, cat: "MODULATORS", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'Random' modulator in Bitwig?",
    opts: [
      "A modulator that generates a new random value on each note trigger",
      "A modulator that randomly assigns MIDI channels",
      "A modulator that randomly selects presets",
      "A modulator that creates noise"
    ],
    ans: 0,
    explain: "The Random modulator outputs a new random value each time a note is triggered — great for humanization and generative patches."
  },
  {
    id: 104, cat: "CORE", diff: DIFFICULTY.MEDIUM,
    q: "What does the keyboard shortcut 'Ctrl/Cmd + Shift + M' do in Bitwig?",
    opts: [
      "Opens the mixer",
      "Adds a new MIDI track",
      "Opens the MIDI mapping overlay for the selected controller",
      "Mutes the selected track"
    ],
    ans: 2,
    explain: "Ctrl/Cmd + Shift + M opens the controller mapping mode for MIDI learn assignments."
  },
  {
    id: 105, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "In Bitwig Studio 6, how is the tool palette now accessed?",
    opts: [
      "Only through keyboard shortcuts",
      "Through a new persistent action bar on the right side with pointer, time selection, pencil, knife, eraser, spray can, and audition tools",
      "Through the menu bar only",
      "Tools were removed in version 6"
    ],
    ans: 1,
    explain: "Bitwig 6 adds a persistent action bar/palette on the right side for quick tool selection, alongside keyboard shortcuts."
  },
  {
    id: 106, cat: "V6", diff: DIFFICULTY.HARD,
    q: "In Bitwig 6, what does the 'Seed' setting on automation clips and lanes control?",
    opts: [
      "The starting value of the automation",
      "A seed for reproducible Spread randomization, ensuring the same random pattern on each playback",
      "The initial tempo",
      "The clip's priority in the launcher"
    ],
    ans: 1,
    explain: "Seed makes Spread (randomization) reproducible — the same seed generates the same random variations every time."
  },
  {
    id: 107, cat: "ARRANGEMENT", diff: DIFFICULTY.HARD,
    q: "What does 'Layered Editing' refer to in Bitwig Studio 6?",
    opts: [
      "Editing multiple audio layers",
      "Editing multiple selected clips simultaneously in the Detail Editor for big-picture multi-track work",
      "Editing instrument layers",
      "Editing nested groups"
    ],
    ans: 1,
    explain: "Layered Editing in Bitwig 6 lets you select and edit multiple clips at once in the Detail Editor for efficient multi-track editing."
  },
  {
    id: 108, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "What does the new Step Input tool in Bitwig Studio 6 allow?",
    opts: [
      "Step sequencing only in the Clip Launcher",
      "Creating notes step by step without real-time playing — entering notes one at a time at configurable step sizes",
      "Stepping through automation points",
      "Importing step sequences from hardware"
    ],
    ans: 1,
    explain: "Step Input lets you enter notes one at a time at precise grid positions — great for programming complex patterns without keyboard skills."
  },
  {
    id: 109, cat: "MIXING", diff: DIFFICULTY.MEDIUM,
    q: "How many send slots does each track have in Bitwig Studio?",
    opts: [
      "2 sends maximum",
      "4 sends maximum",
      "6 sends with an expandable option for more",
      "Unlimited sends"
    ],
    ans: 3,
    explain: "Bitwig tracks support unlimited sends to Effect (FX) tracks."
  },
  {
    id: 110, cat: "HARDWARE", diff: DIFFICULTY.MEDIUM,
    q: "What protocol does Bitwig use for bidirectional communication with modern controllers like Push and Maschine?",
    opts: [
      "Only MIDI",
      "A custom Controller API (scripting-based) that supports bidirectional communication, LED feedback, and display control",
      "OSC only",
      "Bluetooth LE MIDI"
    ],
    ans: 1,
    explain: "Bitwig's Controller API uses JavaScript-based scripts for deep bidirectional integration with hardware controllers."
  },
  {
    id: 111, cat: "CORE", diff: DIFFICULTY.HARD,
    q: "What scripting language is Bitwig's Controller API based on?",
    opts: ["Python", "JavaScript (via Nashorn/GraalJS engine)", "Lua", "C++"],
    ans: 1,
    explain: "Bitwig's Controller API uses JavaScript, enabling custom controller scripts for deep hardware integration."
  },
  {
    id: 112, cat: "GRID", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Chance' module do in The Grid?",
    opts: [
      "Creates a random oscillator",
      "Passes or blocks an incoming gate/trigger based on a set probability percentage",
      "Randomly selects modules",
      "Creates random modulation"
    ],
    ans: 1,
    explain: "The Chance module is a probability gate — it passes or blocks triggers based on a configurable probability, essential for generative patches."
  },
  {
    id: 113, cat: "INSTRUMENTS", diff: DIFFICULTY.MEDIUM,
    q: "What is the 'Drum Machine' device in Bitwig and how does it handle sound sources?",
    opts: [
      "A simple drum sampler only",
      "A container that holds individual instrument/effect chains per pad, each pad fully independent with its own device chain",
      "A preset drum kit player",
      "A MIDI drum mapper"
    ],
    ans: 1,
    explain: "The Drum Machine is a container where each pad can hold its own full instrument and effect chain — total flexibility per voice."
  },
  {
    id: 114, cat: "ADVANCED", diff: DIFFICULTY.MEDIUM,
    q: "What is a 'Selector' device in Bitwig and what does it enable?",
    opts: [
      "It selects audio channels",
      "It switches between multiple device chains — the active chain is selected by index, modulatable for automated switching",
      "It selects tracks",
      "It's a routing utility"
    ],
    ans: 1,
    explain: "Selectors (Instrument Selector, FX Selector) hold multiple chains and switch between them. The selector index is modulatable!"
  },
  {
    id: 115, cat: "MODULATORS", diff: DIFFICULTY.HARD,
    q: "Can modulators in Bitwig modulate other modulators' parameters?",
    opts: [
      "No, modulators can only target device parameters",
      "Yes — modulators can modulate any parameter, including other modulators' rate, depth, and shape",
      "Only LFOs can modulate other modulators",
      "Only in The Grid"
    ],
    ans: 1,
    explain: "Bitwig's modulation system is fully recursive — modulators can modulate each other, creating complex modulation chains."
  },
  {
    id: 116, cat: "V6", diff: DIFFICULTY.MEDIUM,
    q: "In Bitwig Studio 6, what new feature does the Clip Launcher visualization include?",
    opts: [
      "3D waveforms",
      "Real-time clip position and loop count visualization for each track",
      "Frequency spectrum per clip",
      "Album artwork display"
    ],
    ans: 1,
    explain: "Bitwig 6's Clip Launcher now shows the current playback position and loop iteration count for each playing clip."
  },
  {
    id: 117, cat: "GRID", diff: DIFFICULTY.HARD,
    q: "What is a 'Pre-Chord' module in The Grid used for?",
    opts: [
      "Playing chords before the song starts",
      "A polyphonic voice allocation module that distributes incoming voices to downstream modules",
      "A chord detection module",
      "Pre-loading chord libraries"
    ],
    ans: 1,
    explain: "Pre-Chord handles polyphonic voice allocation in Poly Grid, managing how voices are distributed and processed."
  },
  {
    id: 118, cat: "CORE", diff: DIFFICULTY.EASY,
    q: "What is the default file extension for a Bitwig Studio project?",
    opts: [".bw", ".bwproject", ".bitwig", ".bws"],
    ans: 1,
    explain: "Bitwig Studio projects are saved as .bwproject files."
  },
  {
    id: 119, cat: "SAMPLING", diff: DIFFICULTY.MEDIUM,
    q: "In the Bitwig Sampler, what does 'Repitch' mode do?",
    opts: [
      "Applies auto-tune to the sample",
      "Changes playback speed to match pitch — higher notes play faster, like a classic sampler/turntable",
      "Quantizes the sample to a scale",
      "Removes pitch information"
    ],
    ans: 1,
    explain: "Repitch links pitch and speed together — classic sampler behavior where transposing up speeds up playback and vice versa."
  },
  {
    id: 120, cat: "NOTE_FX", diff: DIFFICULTY.MEDIUM,
    q: "What does the 'Quantize' Note FX do in real-time?",
    opts: [
      "Quantizes audio to the nearest pitch",
      "Delays incoming notes to align them with the nearest grid division in real-time during live input",
      "Quantizes the BPM",
      "Rounds velocity values to the nearest 10"
    ],
    ans: 1,
    explain: "The real-time Quantize Note FX snaps incoming notes to the grid as they're played — useful for live performance tightening."
  },
];

// ============ APP ============

const EXAM_CONFIG = {
  PRACTICE: { name: "Practice Mode", count: 20, timePerQ: 0, timed: false },
  QUICK: { name: "Quick Quiz", count: 15, timePerQ: 60, timed: true },
  MOCK: { name: "Full Mock Exam", count: 50, timePerQ: 90, timed: true },
  MARATHON: { name: "Marathon (All Questions)", count: ALL_QUESTIONS.length, timePerQ: 0, timed: false },
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDiffLabel(d) {
  return d === 1 ? "Easy" : d === 2 ? "Medium" : "Hard";
}
function getDiffColor(d) {
  return d === 1 ? "#4ade80" : d === 2 ? "#fbbf24" : "#f87171";
}

export default function BitwigCertApp() {
  const [screen, setScreen] = useState("home");
  const [examMode, setExamMode] = useState(null);
  const [filterCat, setFilterCat] = useState("ALL");
  const [filterDiff, setFilterDiff] = useState("ALL");
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplain, setShowExplain] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef(null);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [showCatSelect, setShowCatSelect] = useState(false);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startExam = useCallback((mode) => {
    const config = EXAM_CONFIG[mode];
    setExamMode(mode);
    let pool = [...ALL_QUESTIONS];
    if (filterCat !== "ALL") pool = pool.filter(q => q.cat === filterCat);
    if (filterDiff !== "ALL") pool = pool.filter(q => q.diff === Number(filterDiff));
    pool = shuffleArray(pool);
    const qs = mode === "MARATHON" ? pool : pool.slice(0, Math.min(config.count, pool.length));
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    setShowExplain(false);
    setScore(0);
    setAnswers([]);
    const total = config.timed ? config.timePerQ * qs.length : 0;
    setTotalTime(total);
    setTimeLeft(total);
    setScreen("quiz");
    if (config.timed && total > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setScreen("results");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [filterCat, filterDiff]);

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[currentQ].ans;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, { qId: questions[currentQ].id, chosen: idx, correct }]);
    setShowExplain(true);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setScreen("results");
      return;
    }
    setCurrentQ(c => c + 1);
    setSelected(null);
    setShowExplain(false);
  };

  const goHome = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScreen("home");
    setExamMode(null);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ============ RENDER ============

  if (screen === "home") {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <svg width="36" height="36" viewBox="0 0 36 36">
                <rect x="2" y="2" width="14" height="14" rx="3" fill="#FF6B35" opacity="0.9"/>
                <rect x="20" y="2" width="14" height="14" rx="3" fill="#FF6B35" opacity="0.6"/>
                <rect x="2" y="20" width="14" height="14" rx="3" fill="#FF6B35" opacity="0.6"/>
                <rect x="20" y="20" width="14" height="14" rx="3" fill="#FF6B35" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <h1 style={styles.title}>BITWIG CERTIFICATION</h1>
              <p style={styles.subtitle}>Exam Practice System</p>
            </div>
          </div>
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statNum}>{ALL_QUESTIONS.length}</span>
              <span style={styles.statLabel}>Questions</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNum}>{Object.keys(CATEGORIES).length}</span>
              <span style={styles.statLabel}>Categories</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statNum}>3</span>
              <span style={styles.statLabel}>Difficulty Levels</span>
            </div>
          </div>
        </div>

        <div style={styles.filterSection}>
          <h3 style={styles.filterTitle}>FILTERS</h3>
          <div style={styles.filterRow}>
            <select style={styles.select} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="ALL">All Categories</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select style={styles.select} value={filterDiff} onChange={e => setFilterDiff(e.target.value)}>
              <option value="ALL">All Difficulties</option>
              <option value="1">Easy</option>
              <option value="2">Medium</option>
              <option value="3">Hard</option>
            </select>
          </div>
        </div>

        <div style={styles.modesGrid}>
          {Object.entries(EXAM_CONFIG).map(([key, config]) => (
            <button key={key} style={styles.modeCard} onClick={() => startExam(key)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={styles.modeIcon}>
                {key === "PRACTICE" && "🎛️"}
                {key === "QUICK" && "⚡"}
                {key === "MOCK" && "📋"}
                {key === "MARATHON" && "🏔️"}
              </div>
              <h3 style={styles.modeName}>{config.name}</h3>
              <p style={styles.modeDesc}>
                {key === "PRACTICE" && `${config.count} random Qs · No timer · Learn at your pace`}
                {key === "QUICK" && `${config.count} Qs · ${config.timePerQ}s each · Test under pressure`}
                {key === "MOCK" && `${config.count} Qs · ${config.timePerQ}s each · Closest to real exam`}
                {key === "MARATHON" && `All ${ALL_QUESTIONS.length} Qs · No timer · Total knowledge check`}
              </p>
            </button>
          ))}
        </div>

        <div style={styles.catGrid}>
          <h3 style={styles.filterTitle}>QUESTION BANK BY CATEGORY</h3>
          <div style={styles.catCards}>
            {Object.entries(CATEGORIES).map(([k, v]) => {
              const count = ALL_QUESTIONS.filter(q => q.cat === k).length;
              return (
                <div key={k} style={styles.catCard}>
                  <span style={styles.catName}>{v}</span>
                  <span style={styles.catCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (screen === "quiz" && questions.length > 0) {
    const q = questions[currentQ];
    const config = EXAM_CONFIG[examMode];
    return (
      <div style={styles.container}>
        <div style={styles.quizHeader}>
          <button style={styles.backBtn} onClick={goHome}>✕ Exit</button>
          <div style={styles.quizInfo}>
            <span style={styles.quizMode}>{config.name}</span>
            {config.timed && (
              <span style={{
                ...styles.timer,
                color: timeLeft < 60 ? "#f87171" : timeLeft < 180 ? "#fbbf24" : "#a8a8a8"
              }}>
                ⏱ {formatTime(timeLeft)}
              </span>
            )}
          </div>
          <span style={styles.qCounter}>
            {currentQ + 1} / {questions.length}
          </span>
        </div>

        <div style={styles.progressBar}>
          <div style={{
            ...styles.progressFill,
            width: `${((currentQ + 1) / questions.length) * 100}%`
          }} />
        </div>

        <div style={styles.questionCard}>
          <div style={styles.qMeta}>
            <span style={{ ...styles.catBadge }}>{CATEGORIES[q.cat]}</span>
            <span style={{ ...styles.diffBadge, color: getDiffColor(q.diff) }}>
              {getDiffLabel(q.diff)}
            </span>
          </div>

          <h2 style={styles.questionText}>{q.q}</h2>

          <div style={styles.optionsContainer}>
            {q.opts.map((opt, i) => {
              let optStyle = { ...styles.option };
              if (selected !== null) {
                if (i === q.ans) {
                  optStyle = { ...optStyle, borderColor: "#4ade80", background: "rgba(74,222,128,0.08)" };
                } else if (i === selected && i !== q.ans) {
                  optStyle = { ...optStyle, borderColor: "#f87171", background: "rgba(248,113,113,0.08)" };
                }
              }
              return (
                <button key={i} style={optStyle} onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  onMouseEnter={e => { if (selected === null) { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.background = "rgba(255,107,53,0.06)"; }}}
                  onMouseLeave={e => { if (selected === null) { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.background = "transparent"; }}}
                >
                  <span style={styles.optLetter}>{String.fromCharCode(65 + i)}</span>
                  <span style={styles.optText}>{opt}</span>
                  {selected !== null && i === q.ans && <span style={styles.checkMark}>✓</span>}
                  {selected !== null && i === selected && i !== q.ans && <span style={styles.crossMark}>✗</span>}
                </button>
              );
            })}
          </div>

          {showExplain && (
            <div style={styles.explainBox}>
              <div style={styles.explainHeader}>
                {selected === q.ans
                  ? <span style={{ color: "#4ade80", fontWeight: 700 }}>✓ Correct</span>
                  : <span style={{ color: "#f87171", fontWeight: 700 }}>✗ Incorrect</span>
                }
              </div>
              <p style={styles.explainText}>{q.explain}</p>
              <button style={styles.nextBtn} onClick={nextQuestion}>
                {currentQ + 1 >= questions.length ? "See Results →" : "Next Question →"}
              </button>
            </div>
          )}
        </div>

        <div style={styles.scoreBar}>
          <span>Score: {score}/{currentQ + (selected !== null ? 1 : 0)}</span>
          {currentQ + (selected !== null ? 1 : 0) > 0 && (
            <span style={{ color: "#a8a8a8" }}>
              ({Math.round((score / (currentQ + (selected !== null ? 1 : 0))) * 100)}%)
            </span>
          )}
        </div>
      </div>
    );
  }

  if (screen === "results") {
    const passed = pct >= 80;
    return (
      <div style={styles.container}>
        <div style={styles.resultsCard}>
          <div style={styles.resultIcon}>
            {passed ? "🏆" : pct >= 60 ? "📊" : "📚"}
          </div>
          <h1 style={{ ...styles.resultTitle, color: passed ? "#4ade80" : pct >= 60 ? "#fbbf24" : "#f87171" }}>
            {passed ? "PASSED!" : pct >= 60 ? "ALMOST THERE" : "KEEP STUDYING"}
          </h1>
          <div style={styles.resultScore}>
            <span style={styles.resultPct}>{pct}%</span>
            <span style={styles.resultDetail}>{score} / {questions.length} correct</span>
          </div>
          <div style={styles.resultThreshold}>
            <div style={styles.thresholdBar}>
              <div style={{ ...styles.thresholdFill, width: `${pct}%`, background: passed ? "#4ade80" : pct >= 60 ? "#fbbf24" : "#f87171" }} />
              <div style={styles.thresholdMark} />
            </div>
            <span style={styles.thresholdLabel}>80% passing threshold</span>
          </div>

          <div style={styles.catBreakdown}>
            <h3 style={styles.breakdownTitle}>Category Breakdown</h3>
            {Object.entries(CATEGORIES).map(([k, v]) => {
              const catAs = answers.filter(a => questions.find(q => q.id === a.qId)?.cat === k);
              if (catAs.length === 0) return null;
              const catCorrect = catAs.filter(a => a.correct).length;
              const catPct = Math.round((catCorrect / catAs.length) * 100);
              return (
                <div key={k} style={styles.breakdownRow}>
                  <span style={styles.breakdownCat}>{v}</span>
                  <div style={styles.breakdownBarOuter}>
                    <div style={{
                      ...styles.breakdownBarInner,
                      width: `${catPct}%`,
                      background: catPct >= 80 ? "#4ade80" : catPct >= 60 ? "#fbbf24" : "#f87171"
                    }} />
                  </div>
                  <span style={styles.breakdownPct}>{catCorrect}/{catAs.length}</span>
                </div>
              );
            })}
          </div>

          <div style={styles.resultActions}>
            <button style={styles.retryBtn} onClick={() => startExam(examMode)}>
              Retry Same Mode
            </button>
            <button style={styles.homeBtn} onClick={goHome}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <p style={{ color: "#a8a8a8", textAlign: "center", padding: 40 }}>
        No questions match your filters. Try broadening your selection.
      </p>
      <button style={styles.homeBtn} onClick={goHome}>Back</button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#e8e8e8",
    fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
    padding: "20px",
    maxWidth: 860,
    margin: "0 auto",
  },
  header: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: "1px solid #222",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  logoIcon: { flexShrink: 0 },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "#FF6B35",
    letterSpacing: "0.15em",
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    margin: 0,
    marginTop: 2,
    letterSpacing: "0.08em",
  },
  statsBar: {
    display: "flex",
    gap: 32,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
  },
  statNum: {
    fontSize: 24,
    fontWeight: 700,
    color: "#FF6B35",
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#666",
    letterSpacing: "0.15em",
    marginBottom: 10,
  },
  filterRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  select: {
    background: "#161616",
    border: "1px solid #333",
    color: "#e8e8e8",
    padding: "10px 14px",
    borderRadius: 8,
    fontFamily: "inherit",
    fontSize: 13,
    cursor: "pointer",
    outline: "none",
    minWidth: 180,
  },
  modesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginBottom: 32,
  },
  modeCard: {
    background: "#111",
    border: "1px solid #333",
    borderRadius: 12,
    padding: "20px 16px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    fontFamily: "inherit",
    color: "#e8e8e8",
  },
  modeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  modeName: {
    fontSize: 14,
    fontWeight: 700,
    margin: "0 0 6px 0",
    color: "#e8e8e8",
  },
  modeDesc: {
    fontSize: 11,
    color: "#888",
    margin: 0,
    lineHeight: 1.5,
  },
  catGrid: {
    marginBottom: 32,
  },
  catCards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 8,
  },
  catCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#111",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "10px 14px",
  },
  catName: {
    fontSize: 12,
    color: "#aaa",
  },
  catCount: {
    fontSize: 14,
    fontWeight: 700,
    color: "#FF6B35",
  },
  // Quiz screen
  quizHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
    flexWrap: "wrap",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#888",
    padding: "6px 14px",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 12,
  },
  quizInfo: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  quizMode: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: 600,
  },
  timer: {
    fontSize: 16,
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
  },
  qCounter: {
    fontSize: 13,
    color: "#666",
    fontVariantNumeric: "tabular-nums",
  },
  progressBar: {
    height: 3,
    background: "#222",
    borderRadius: 2,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#FF6B35",
    borderRadius: 2,
    transition: "width 0.3s ease",
  },
  questionCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 16,
    padding: "28px 24px",
    marginBottom: 16,
  },
  qMeta: {
    display: "flex",
    gap: 10,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  catBadge: {
    fontSize: 10,
    padding: "4px 10px",
    borderRadius: 20,
    background: "rgba(255,107,53,0.12)",
    color: "#FF6B35",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  diffBadge: {
    fontSize: 10,
    padding: "4px 10px",
    borderRadius: 20,
    background: "rgba(255,255,255,0.04)",
    fontWeight: 600,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 17,
    fontWeight: 500,
    lineHeight: 1.6,
    margin: "0 0 24px 0",
    color: "#f0f0f0",
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  option: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 16px",
    background: "transparent",
    border: "1px solid #333",
    borderRadius: 10,
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    color: "#e0e0e0",
    fontSize: 14,
    lineHeight: 1.5,
    transition: "all 0.15s",
    position: "relative",
  },
  optLetter: {
    flexShrink: 0,
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    background: "rgba(255,255,255,0.06)",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    color: "#888",
  },
  optText: {
    flex: 1,
    paddingTop: 2,
  },
  checkMark: {
    color: "#4ade80",
    fontWeight: 700,
    fontSize: 18,
    marginLeft: "auto",
    flexShrink: 0,
  },
  crossMark: {
    color: "#f87171",
    fontWeight: 700,
    fontSize: 18,
    marginLeft: "auto",
    flexShrink: 0,
  },
  explainBox: {
    marginTop: 20,
    padding: "16px 20px",
    background: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    borderLeft: "3px solid #FF6B35",
  },
  explainHeader: {
    marginBottom: 8,
    fontSize: 14,
  },
  explainText: {
    fontSize: 13,
    color: "#bbb",
    lineHeight: 1.7,
    margin: "0 0 16px 0",
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
  },
  nextBtn: {
    background: "#FF6B35",
    border: "none",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.03em",
  },
  scoreBar: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    fontSize: 13,
    color: "#666",
    padding: "8px 0",
  },
  // Results
  resultsCard: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 16,
    padding: "40px 32px",
    textAlign: "center",
    maxWidth: 600,
    margin: "40px auto 0",
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 800,
    letterSpacing: "0.1em",
    margin: "0 0 24px 0",
  },
  resultScore: {
    marginBottom: 24,
  },
  resultPct: {
    fontSize: 56,
    fontWeight: 800,
    color: "#FF6B35",
    display: "block",
    lineHeight: 1,
  },
  resultDetail: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    display: "block",
  },
  resultThreshold: {
    marginBottom: 32,
  },
  thresholdBar: {
    height: 8,
    background: "#222",
    borderRadius: 4,
    position: "relative",
    overflow: "hidden",
    marginBottom: 8,
  },
  thresholdFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.5s ease",
  },
  thresholdMark: {
    position: "absolute",
    left: "80%",
    top: -2,
    width: 2,
    height: 12,
    background: "#fff",
    borderRadius: 1,
  },
  thresholdLabel: {
    fontSize: 11,
    color: "#666",
  },
  catBreakdown: {
    textAlign: "left",
    marginBottom: 32,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#888",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: 16,
    textAlign: "center",
  },
  breakdownRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  breakdownCat: {
    fontSize: 11,
    color: "#aaa",
    minWidth: 150,
    flexShrink: 0,
  },
  breakdownBarOuter: {
    flex: 1,
    height: 6,
    background: "#222",
    borderRadius: 3,
    overflow: "hidden",
  },
  breakdownBarInner: {
    height: "100%",
    borderRadius: 3,
    transition: "width 0.4s ease",
  },
  breakdownPct: {
    fontSize: 12,
    color: "#888",
    minWidth: 40,
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  resultActions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  retryBtn: {
    background: "#FF6B35",
    border: "none",
    color: "#fff",
    padding: "12px 28px",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 600,
  },
  homeBtn: {
    background: "transparent",
    border: "1px solid #444",
    color: "#aaa",
    padding: "12px 28px",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
  },
};
