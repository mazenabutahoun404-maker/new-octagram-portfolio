import { useCallback, useEffect, useRef, useState } from "react";

export type AmbientGraph = {
    context: AudioContext;
    source: AudioBufferSourceNode;
    filter: BiquadFilterNode;
    gain: GainNode;
    lfo: OscillatorNode;
    lfoGain: GainNode;
};

export function useAmbientSound() {
    const graphRef = useRef<AmbientGraph | null>(null);
    const [enabled, setEnabled] = useState(false);

    const stop = useCallback(() => {
        const graph = graphRef.current;
        if (!graph) return;

        const now = graph.context.currentTime;
        graph.gain.gain.cancelScheduledValues(now);
        graph.gain.gain.setTargetAtTime(0.0001, now, 0.12);

        window.setTimeout(() => {
            try {
                graph.source.stop();
                graph.lfo.stop();
            } catch {
                // The nodes may already be stopped during development hot reload.
            }
            void graph.context.close();
        }, 700);

        graphRef.current = null;
        setEnabled(false);
    }, []);

    const start = useCallback(() => {
        if (graphRef.current) return;

        const AudioContextClass =
            window.AudioContext ||
            (window as typeof window & { webkitAudioContext?: typeof AudioContext })
                .webkitAudioContext;
        if (!AudioContextClass) return;

        const context = new AudioContextClass();
        const length = context.sampleRate * 4;
        const buffer = context.createBuffer(1, length, context.sampleRate);
        const channel = buffer.getChannelData(0);

        for (let index = 0; index < length; index += 1) {
            const slowWave = Math.sin((index / length) * Math.PI * 8) * 0.08;
            channel[index] = (Math.random() * 2 - 1) * (0.48 + slowWave);
        }

        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const gain = context.createGain();
        const lfo = context.createOscillator();
        const lfoGain = context.createGain();

        source.buffer = buffer;
        source.loop = true;
        filter.type = "lowpass";
        filter.frequency.value = 1600;
        filter.Q.value = 0.7;
        gain.gain.value = 0.0001;
        lfo.frequency.value = 0.08;
        lfoGain.gain.value = 0.007;

        lfo.connect(lfoGain).connect(gain.gain);
        source.connect(filter).connect(gain).connect(context.destination);
        source.start();
        lfo.start();
        gain.gain.setTargetAtTime(0.018, context.currentTime, 0.35);

        graphRef.current = { context, source, filter, gain, lfo, lfoGain };
        setEnabled(true);
    }, []);

    const toggle = useCallback(() => {
        if (graphRef.current) stop();
        else start();
    }, [start, stop]);

    useEffect(() => stop, [stop]);

    return { enabled, toggle, graphRef };
}
