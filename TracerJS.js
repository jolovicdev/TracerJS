async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.textBaseline = 'top';
    context.font = '14px Arial';
    context.fillStyle = '#f60';
    context.fillRect(125, 1, 62, 20);
    context.fillStyle = '#069';
    context.fillText('Browser Fingerprint', 2, 15);
    context.fillStyle = 'rgba(102, 204, 0, 0.7)';
    context.fillText('Browser Fingerprint', 4, 17);
    return canvas.toDataURL();
}

function getWebGLFingerprint() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        return 'unsupported';
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown_renderer';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown_vendor';

    const params = [
        gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        gl.getParameter(gl.MAX_TEXTURE_SIZE),
        gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE),
    ].join('###');

    return `${renderer}###${vendor}###${params}`;
}

function getAudioFingerprint() {
    const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(0);
    audioContext.startRendering();

    return new Promise((resolve) => {
        audioContext.oncomplete = (event) => {
            const fingerprint = event.renderedBuffer.getChannelData(0).slice(0, 100).toString();
            resolve(fingerprint);
        };
    });
}

async function generateAdvancedFingerprint() {
    const screenResolution = `${screen.width}x${screen.height}`;
    const userAgent = navigator.userAgent;
    const language = navigator.language || navigator.userLanguage;
    const timezoneOffset = new Date().getTimezoneOffset();

    const canvasFingerprint = getCanvasFingerprint();
    const webGLFingerprint = getWebGLFingerprint();
    const audioFingerprint = await getAudioFingerprint();

    const fingerprintData = {
        userAgent,
        language,
        timezoneOffset,
        canvasFingerprint,
        webGLFingerprint,
        audioFingerprint
    };

    const fingerprintString = [
        userAgent,
        language,
        timezoneOffset,
        canvasFingerprint,
        webGLFingerprint,
        audioFingerprint
    ].join('###');

    const finalHash = await sha256(fingerprintString);
    console.log(finalHash);
    return { fingerprintData, finalHash };
}
