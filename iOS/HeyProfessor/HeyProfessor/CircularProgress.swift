//
//  CircularProgress.swift
//  HeyProfessor
//
//  Created by Mathias BRAGAGIA on 13/06/2024.
//

import SwiftUI

#Preview {
    CircularProgressView(progress: 0.5)
}

struct CircularProgressView: View {
    let progress: Double
    
    var body: some View {
        ZStack {
            Circle()
                .stroke(
                    Color.black.opacity(0.1),
                    lineWidth: 3
                )
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    Color.black,
                    style: StrokeStyle(
                        lineWidth: 3,
                        lineCap: .round
                    )
                )
                .rotationEffect(.degrees(-90))
                // 1
                .animation(.easeOut, value: progress)

        }
    }
}
