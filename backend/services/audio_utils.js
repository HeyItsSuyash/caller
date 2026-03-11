const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');

// Set the path to the ffmpeg executable provided by @ffmpeg-installer/ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

/**
 * Converts any audio file to a 16kHz mono WAV file suitable for Sarvam STT.
 * @param {string} inputPath - Path to the original audio file.
 * @param {string} outputPath - Path to save the converted WAV file.
 * @returns {Promise<string>} - The path to the converted file.
 */
function convertTo16kHzMonoWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('wav')
            .audioChannels(1)
            .audioFrequency(16000)
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('[Audio Utils] FFmpeg conversion error:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = { convertTo16kHzMonoWav };
