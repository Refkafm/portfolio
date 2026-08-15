import AppKit
import Foundation
import ImageIO
import UniformTypeIdentifiers

let fileManager = FileManager.default
let root = URL(fileURLWithPath: fileManager.currentDirectoryPath)
let items = [
    ("assets/project-xyz.png", "assets/motion-xyz.gif"),
    ("assets/project-ideal-protein.png", "assets/motion-ideal.gif"),
    ("assets/project-unbox.png", "assets/motion-unbox.gif"),
    ("assets/project-hublr.png", "assets/motion-hublr.gif")
]

func cgImage(from url: URL) -> CGImage? {
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil) else { return nil }
    return CGImageSourceCreateImageAtIndex(source, 0, nil)
}

func makeFrame(source: CGImage, width: Int, height: Int, phase: Double) -> CGImage? {
    guard let context = CGContext(
        data: nil,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: 0,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    ) else { return nil }

    context.interpolationQuality = .high
    let sourceRatio = CGFloat(source.width) / CGFloat(source.height)
    let targetRatio = CGFloat(width) / CGFloat(height)
    var drawWidth: CGFloat
    var drawHeight: CGFloat
    if sourceRatio > targetRatio {
        drawHeight = CGFloat(height)
        drawWidth = drawHeight * sourceRatio
    } else {
        drawWidth = CGFloat(width)
        drawHeight = drawWidth / sourceRatio
    }

    let wave = CGFloat(sin(phase))
    let drift = CGFloat(cos(phase))
    let scale = 1.035 + 0.018 * wave
    drawWidth *= scale
    drawHeight *= scale
    let x = (CGFloat(width) - drawWidth) / 2 + drift * 7
    let y = (CGFloat(height) - drawHeight) / 2 + wave * 5
    context.draw(source, in: CGRect(x: x, y: y, width: drawWidth, height: drawHeight))
    return context.makeImage()
}

for (inputPath, outputPath) in items {
    let input = root.appendingPathComponent(inputPath)
    let output = root.appendingPathComponent(outputPath)
    guard let source = cgImage(from: input) else {
        fputs("Could not read \(inputPath)\n", stderr)
        continue
    }

    let sourceRatio = Double(source.width) / Double(source.height)
    let targetWidth = 560
    let targetHeight = max(360, Int(Double(targetWidth) / sourceRatio))
    guard let destination = CGImageDestinationCreateWithURL(
        output as CFURL,
        UTType.gif.identifier as CFString,
        16,
        nil
    ) else { continue }

    let gifProperties: [CFString: Any] = [
        kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFLoopCount: 0]
    ]
    CGImageDestinationSetProperties(destination, gifProperties as CFDictionary)

    for frameIndex in 0..<16 {
        let phase = (Double(frameIndex) / 16.0) * Double.pi * 2
        guard let frame = makeFrame(source: source, width: targetWidth, height: targetHeight, phase: phase) else { continue }
        let frameProperties: [CFString: Any] = [
            kCGImagePropertyGIFDictionary: [kCGImagePropertyGIFDelayTime: 0.11]
        ]
        CGImageDestinationAddImage(destination, frame, frameProperties as CFDictionary)
    }

    if CGImageDestinationFinalize(destination) {
        print("Created \(outputPath)")
    }
}
