//
//  GradientBorderButtonStyle.swift
//  LearningTrail-11112022
//
//  Created by Matthew Young on 1/2/23.
//

import SwiftUI
import Shimmer

extension Color {
    static var rainbowColors: [Color] { [.red, .orange, .yellow, .green, .blue, .indigo, .cyan] }
    static var randomizedRainbowColors: [Color] { [Color.red, .blue, .green, .orange, .yellow, .mint, .brown, .indigo] }
}


// Round corner radius is proportional to the view size
struct RoundedRectangleShape: Shape {
    func path(in rect: CGRect) -> Path {
//        Path { path in
//            let radius = min(rect.width, rect.height) * 25 / 100
//            path.addRoundedRect(in: rect, cornerSize: .init(width: radius, height: radius))
//        }
//
        Path(roundedRect: rect, cornerRadius: min(rect.width, rect.height) * 0.25, style: .continuous)
    }
}

struct GradientBorderButtonStyle<S: ShapeStyle>: ButtonStyle {
    let style: S
    let lineWidth: Double
    
    init(style: S, lineWidth: Double = 8.0) {
        self.style = style
        self.lineWidth = lineWidth
    }
    
    static var defaultStyle: AngularGradient {
        let colors = Color.randomizedRainbowColors
        return AngularGradient(colors: colors, center: .center, startAngle: .degrees(0), endAngle: .degrees(360))
    }
 
    
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .padding()
            .overlay {
                Capsule()
                    .stroke(style, lineWidth: lineWidth)
            }
    }
}



struct StyledBorderViewModifier<S: ShapeStyle>: ViewModifier {
    let style: S
    let lineWidth: Double?

    
    // "SE-0347 Type inference from default expressions" allows for  default values:
    init(style: S = Self.defaultStyle, lineWidth: Double? = nil) {
        self.style = style
        self.lineWidth = lineWidth
    }

    @State private var viewSize = CGSize.zero

    var computeLineWidth: Double {
        lineWidth ?? min(viewSize.width, viewSize.height) * 0.15
    }

    static var defaultStyle: AngularGradient {
        let colors = Color.randomizedRainbowColors
        return AngularGradient(colors: colors + [colors.first!], center: .center, startAngle: .degrees(0), endAngle: .degrees(360))
    }

    func body(content: Content) -> some View {
        content
            //.padding()
            //.readSize($into: $viewSize)
            .overlay {
                Capsule()
                    .stroke(style, lineWidth: computeLineWidth)
            }
        
    }
}



struct GradientBorderButtonStyleDemo: View {
    var body: some View {
        VStack(spacing: 50) {
            Button {
                
            } label: {
                Text("Gradient Border Button")
                    .font(.title)
            }
            .modifier(StyledBorderViewModifier())
            .shimmering()



            Button {
                
            } label: {
                Text("Gradient Border Button")
                    .font(.title)
            }
            .buttonStyle(.borderedProminent)
            .modifier(StyledBorderViewModifier(lineWidth: 4))

        }
    }
}

struct GradientBorderButtonStyleDemo_Previews: PreviewProvider {
    static var previews: some View {
        GradientBorderButtonStyleDemo()
    }
}
