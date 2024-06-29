//
//  ContentView.swift
//  HeyProfessor
//
//  Created by Mathias BRAGAGIA on 12/06/2024.
//

import SwiftUI
import SwiftUICharts

#Preview {
    HomeScreen()
}

struct HomeScreen: View {
    @State private var showRevision = false
    
    var body: some View {
        ZStack {
            VStack (spacing: 0) {
                // Resources Library Section
                HStack {
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 20))
                    
                    Spacer()
                    
                    Text("Hey Professor!")
                        .font(.custom("Cochin-Bold", size: 30))
                        .bold()
                    
                    Spacer()
                    
                    Image(systemName: "square.and.pencil")
                        .font(.system(size: 20))
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 8)
                
                ScrollView {
                    LazyVStack (spacing: 0) {
                        MultiLineChartView(
                            data: [([0,0,0,30,60,90,140], GradientColors.purple), ([0,0,0,40,120,160,160], GradientColors.orngPink)],
                            title: "",
                            legend: "Last month progress",
                            form: CGSize(width:400, height:90),
                            rateValue: 5,
                            dropShadow: false
                        )
                        .padding(.top, -40)
                        
                        ForEach(["Continue", "Discover", "Explore", "Your library"], id: \.self) { category in
                            VStack (alignment: .leading, spacing: 0) {
                                Divider()
                                    .background(.gray.opacity(0.3))
                                    .padding(.top, 5)
                                    .padding(.bottom, 5)
                                
                                HStack (alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/) {
                                    Text(category)
                                        //.font(.custom("TimesNewRomanPS-BoldMT", size: 23))
                                        .font(.system(size: 16, weight: .medium))
                                        .padding(.bottom, 5)
                                        .padding(.top, 8)
                                    
                                    if (category == "Your library") {
                                        Spacer()
                                        
                                        Text("View all")
                                            .font(.system(size: 12))
                                    }
                                }
                                .padding(.horizontal, 20)
                                
                                ScrollView (.horizontal) {
                                    LazyHStack (alignment: .top) {
                                        ForEach(userResources, id: \.id) { resource in
                                            ResourceCard(resource: resource)
                                        }
                                    }
                                    .padding(.leading, 15)
                                }
                            }
                            /*.background(LinearGradient(
                                gradient: Gradient(colors: [.black.opacity(0.05), .white]),
                                startPoint: .topLeading,
                                endPoint: .bottom)
                            )*/
                        }
                    }
                    .padding(.bottom, 60) // For Start daily revision button
                }
                
                
            }
            
            VStack {
                Spacer()
                
                Button(action: {
                    // Action to start revision
                    startRevision()
                }) {
                    HStack {
                        HStack {
                            Image(systemName: "lineweight")
                                .foregroundColor(.black)
                            
                            Text("4")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.black)
                                .padding(.leading, -6)
                        }
                        
                        
                        Spacer()
                        
                        HStack {
                            Text("Start daily revision")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.black)
                            
                            Image(systemName: "goforward")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.black)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.vertical, 15)
                    .frame(maxWidth: .infinity)
                    .background(Color(red: 0.98, green: 0.98, blue: 0.98))
                    .cornerRadius(100)
                    .modifier(StyledBorderViewModifier(lineWidth: 2))
                    .shadow(color: Color.black.opacity(0.2), radius: 5, x: 0, y: 5)
                    .padding(.horizontal, 12)
                    
                }
                .transition(.opacity)
                
            }
            
        }
    }
    
    // Sample function to check if there are revisions
    private func hasRevisions() -> Bool {
        // Replace with actual logic
        return true
    }
    
    // Sample function to start revision
    private func startRevision() {
        // Replace with actual logic
        showRevision.toggle()
    }
    
    // Sample user resources
    private var userResources: [Resource] {
        // Replace with actual resources
        return [
            Resource(id: UUID(), title: "Sapiens: Histoire du monde bla et blablabal", illustration: "book"),
            Resource(id: UUID(), title: "Resource 2", illustration: "article"),
            Resource(id: UUID(), title: "Resource 3", illustration: "video")
        ]
    }
}

struct ResourceCard: View {
    let resource: Resource
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Image("homeImage")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(height: 100)
                .frame(maxWidth: 150)
                .clipped()
                .cornerRadius(10)
                .shadow(color: Color.black.opacity(0.2), radius: 5, x: 0, y: 5)
            
            HStack(alignment: .top, spacing: 0) {
                Text(resource.title)
                    .font(.system(size: 13))
                    .fixedSize(horizontal: false, vertical: true)
                    .lineLimit(2)
                    .foregroundColor(.primary)
                    .frame(maxWidth: 110, alignment: .leading)
                    .padding(.bottom, 13)
                
                Spacer()
                
                CircularProgressView(progress: 0.5)
                    .padding(.vertical, 4)
                    .frame(width: 16, height: 16)
            }
            .padding(.horizontal, 5)
        }
        .padding(.vertical, 5)
    }
}

struct Resource: Identifiable {
    var id: UUID
    var title: String
    var illustration: String
}

struct HomeScreen_Previews: PreviewProvider {
    static var previews: some View {
        HomeScreen()
    }
}
