import { useState } from 'react'
// Woods course hole diagrams
import woods1 from '../../../images/Diagrams/Woods1.png'
import woods2 from '../../../images/Diagrams/Woods2.png'
import woods3 from '../../../images/Diagrams/Woods3.png'
import woods4 from '../../../images/Diagrams/Woods4.png'
import woods5 from '../../../images/Diagrams/Woods5.png'
import woods6 from '../../../images/Diagrams/Woods6.png'
import woods7 from '../../../images/Diagrams/Woods7.png'
import woods8 from '../../../images/Diagrams/Woods8.png'
import woods9 from '../../../images/Diagrams/Woods9.png'
import birches1 from '../../../images/Diagrams/Birches1.png'
import birches2 from '../../../images/Diagrams/Birches2.png'
import birches3 from '../../../images/Diagrams/Birches3.png'
import birches4 from '../../../images/Diagrams/Birches4.png'
import birches5 from '../../../images/Diagrams/Birches5.png'
import birches6 from '../../../images/Diagrams/Birches6.png'
import birches7 from '../../../images/Diagrams/Birches7.png'
import birches8 from '../../../images/Diagrams/Birches8.png'
import birches9 from '../../../images/Diagrams/Birches9.png'
import farms1 from '../../../images/Diagrams/Farms1.png'
import farms2 from '../../../images/Diagrams/Farms2.png'
import farms3 from '../../../images/Diagrams/Farms3.png'
import farms4 from '../../../images/Diagrams/Farms4.png'
import farms5 from '../../../images/Diagrams/Farms5.png'
import farms6 from '../../../images/Diagrams/Farms6.png'
import farms7 from '../../../images/Diagrams/Farms7.png'
import farms8 from '../../../images/Diagrams/Farms8.png'
import farms9 from '../../../images/Diagrams/Farms9.png'

const CoursesDetail = () => {
  const [activeHoles, setActiveHoles] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0 })

  const handleHoleChange = (courseIndex: number, holeIndex: number) => {
    setActiveHoles(prev => ({
      ...prev,
      [courseIndex]: holeIndex
    }))
  }
  const courses = [
    {
      name: "The Birches Course",
      description: "Navigate challenging dogleg holes with downhill tee shots and uphill approaches to bunker-protected greens. This course rewards strategic thinking and precise club selection through birch-lined fairways.",
      holes: [
        {
          number: 1,
          par: 4,
          yardages: [405, 389, 335, 317, 268],
          caddieNotes: "This par 4 hole is a relatively challenging dogleg left with a downhill tee shot that tends to fall to the right. Your approach shot is then uphill to a green guarded by bunkers on the left and right. Preferred tee shot is left center of the fairway and can play a club longer if you are on the right side of the fairway."
        },
        {
          number: 2,
          par: 3,
          yardages: [170, 150, 130, 115, 100],
          caddieNotes: "Scenic par 3 through the birch trees. The elevated green is well-protected and requires precise club selection. Wind through the trees can affect ball flight."
        },
        {
          number: 3,
          par: 4,
          yardages: [380, 355, 330, 305, 275],
          caddieNotes: "Dogleg right par 4 with downhill tee shot. The fairway tilts left towards trouble, so accuracy is more important than distance off the tee."
        },
        {
          number: 4,
          par: 5,
          yardages: [510, 485, 460, 430, 390],
          caddieNotes: "Three-shot par 5 through mature birch forest. The second shot must be positioned carefully to avoid fairway bunkers and set up ideal approach angle."
        },
        {
          number: 5,
          par: 4,
          yardages: [395, 370, 345, 320, 290],
          caddieNotes: "Challenging par 4 with elevated tee and approach. The green sits above the fairway and is well-bunkered, requiring precise distance control."
        },
        {
          number: 6,
          par: 3,
          yardages: [160, 145, 125, 110, 95],
          caddieNotes: "Short par 3 to a green protected by bunkers. The green slopes from back to front, making above-the-hole putts very challenging."
        },
        {
          number: 7,
          par: 4,
          yardages: [415, 390, 365, 340, 310],
          caddieNotes: "Long par 4 with slight dogleg left. The tee shot must avoid fairway bunkers to set up manageable approach to the elevated, well-protected green."
        },
        {
          number: 8,
          par: 5,
          yardages: [525, 500, 475, 445, 405],
          caddieNotes: "Long par 5 finishing hole that demands three quality shots. The green is elevated and surrounded by bunkers, making precision essential for scoring."
        },
        {
          number: 9,
          par: 4,
          yardages: [400, 375, 350, 325, 295],
          caddieNotes: "Classic finishing par 4 through the birches. Uphill approach to elevated green that slopes away from the fairway, requiring confident approach shot."
        }
      ]
    },
    {
      name: "The Woods Course",
      description: "A masterpiece that showcases attention to detail and utilizes the terrain's natural, undulating topography. From stunning views of Lake Michigan beginning with the very first hole, to the many elevated tee boxes, this is a truly impressive course.",
      holes: [
        {
          number: 1,
          par: 4,
          yardages: [352, 325, 316, 290, 228],
          caddieNotes: "A beautiful elevated tee box overlooking the par 4 hole and Lake Michigan. There's a 90'-100' elevation drop from the tee to the fairway. Not a particularly long par 4 but a well placed tee shot is critical. Anything outside of the fairway can be a lost ball or a difficult shot back to the fairway. Your driver may not always be the right play off the tee."
        },
        {
          number: 2,
          par: 3,
          yardages: [165, 150, 140, 125, 105],
          caddieNotes: "Scenic par 3 with elevated tee requiring precise club selection. The green is well-protected by bunkers and the Michigan wind can significantly affect ball flight."
        },
        {
          number: 3,
          par: 4,
          yardages: [385, 365, 340, 315, 285],
          caddieNotes: "Challenging dogleg right through mature hardwoods. Strategic placement off the tee is crucial to set up the best angle for your approach to the elevated green."
        },
        {
          number: 4,
          par: 5,
          yardages: [520, 495, 470, 440, 395],
          caddieNotes: "Long par 5 with multiple elevation changes. Risk/reward second shot can reach the green in two, but requires precise execution over water hazard."
        },
        {
          number: 5,
          par: 4,
          yardages: [410, 385, 360, 335, 305],
          caddieNotes: "Straight par 4 with fairway bunkers guarding the landing area. The approach shot is to a well-protected green with deep bunkers on both sides."
        },
        {
          number: 6,
          par: 3,
          yardages: [185, 165, 145, 125, 110],
          caddieNotes: "Beautiful par 3 playing over natural wetlands. Club selection is critical as the green slopes away from the tee, making distance control essential."
        },
        {
          number: 7,
          par: 4,
          yardages: [395, 370, 345, 320, 295],
          caddieNotes: "Dogleg left with elevated tee shot. The fairway narrows significantly in the landing area, demanding accuracy off the tee for the best approach angle."
        },
        {
          number: 8,
          par: 5,
          yardages: [505, 480, 455, 425, 385],
          caddieNotes: "Reachable par 5 for longer hitters, but water guards the left side of the green. Conservative play to the right sets up an easy wedge for birdie opportunity."
        },
        {
          number: 9,
          par: 4,
          yardages: [425, 400, 375, 350, 320],
          caddieNotes: "Strong finishing hole with elevated tee and approach shot. The green is tiered and well-bunkered, requiring precise approach shot for scoring opportunity."
        }
      ]
    },
    {
      name: "The Farms Course",
      description: "Classic farmland golf featuring strategic fairway bunkers and well-guarded greens where pin placement creates unique challenges. This traditional design rewards careful consideration and strategic thinking.",
      holes: [
        {
          number: 1,
          par: 4,
          yardages: [418, 399, 362, 310, 258],
          caddieNotes: "Straight away par 4 to start the Farms course. Fairway bunkers on both sides can come into play. This small, well guarded green slopes towards you in the front and away from you on the back and left so the pin placement is very important to your club selection."
        },
        {
          number: 2,
          par: 3,
          yardages: [175, 155, 135, 115, 95],
          caddieNotes: "Traditional par 3 over farmland terrain. Wind is often a factor on this exposed hole. The green is protected by strategic bunkers placed to catch errant shots."
        },
        {
          number: 3,
          par: 5,
          yardages: [535, 510, 485, 455, 415],
          caddieNotes: "Long par 5 through classic farmland. The second shot must avoid fairway bunkers to set up scoring opportunity. The large green accepts a variety of approach shots."
        },
        {
          number: 4,
          par: 4,
          yardages: [390, 365, 340, 315, 285],
          caddieNotes: "Dogleg right par 4 with strategic fairway bunkers. The approach shot is to a well-elevated green that requires precise distance control."
        },
        {
          number: 5,
          par: 3,
          yardages: [155, 140, 125, 110, 95],
          caddieNotes: "Short par 3 requiring precision over power. The green is small and slopes significantly from back to front, making club selection crucial."
        },
        {
          number: 6,
          par: 4,
          yardages: [405, 380, 355, 330, 300],
          caddieNotes: "Challenging par 4 with narrow fairway landing area. Strategic fairway bunkers guard both sides, requiring accurate tee shot placement."
        },
        {
          number: 7,
          par: 5,
          yardages: [520, 495, 470, 440, 400],
          caddieNotes: "Risk/reward par 5 with water hazard guarding the green. Conservative play to the right sets up safe approach, while aggressive line can yield eagle opportunity."
        },
        {
          number: 8,
          par: 4,
          yardages: [375, 350, 325, 300, 275],
          caddieNotes: "Straightforward par 4 that plays longer than the yardage suggests. Elevated green requires one extra club, and pin position greatly affects approach strategy."
        },
        {
          number: 9,
          par: 4,
          yardages: [440, 415, 390, 365, 335],
          caddieNotes: "Strong finishing hole demanding length and accuracy. The green is well-protected by bunkers and slopes away from the fairway, requiring precise approach shot."
        }
      ]
    }
  ]

  const teeColors = [
    { color: 'bg-black', label: 'Championship' },
    { color: 'bg-blue-600', label: 'Blue', style: { backgroundColor: '#2563eb' } },
    { color: 'bg-gray-100 border border-gray-400', label: 'White' },
    { color: 'bg-yellow-500', label: 'Gold', style: { backgroundColor: '#eab308' } },
    { color: 'bg-gray-400', label: 'Silver', style: { backgroundColor: '#9ca3af' } }
  ]  // Hole diagrams for each course
  const courseDiagrams: { [key: number]: string[] } = {
    0: [birches1, birches2, birches3, birches4, birches5, birches6, birches7, birches8, birches9],   // Birches Course
    1: [woods1, woods2, woods3, woods4, woods5, woods6, woods7, woods8, woods9], // Woods Course
    2: [farms1, farms2, farms3, farms4, farms5, farms6, farms7, farms8, farms9], // Farms Course
  }
  // Function to get current image based on active hole
  const getCurrentImage = (courseIndex: number) => {
    const activeHoleIndex = activeHoles[courseIndex]
    return courseDiagrams[courseIndex][activeHoleIndex]
  }

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
            Three Distinctive Golf Experiences
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto"></div>
          <p className="text-xl text-primary-700 max-w-4xl mx-auto leading-relaxed">
            Each of our three 9-hole courses offers its own unique character and challenges, 
            creating endless combinations for your perfect round of golf.
          </p>
        </div>        <div className="space-y-32">
          {courses.map((course, courseIndex) => (
            <div key={course.name} className="space-y-12">
              {/* Course Header */}
              <div className="text-center space-y-4">
                <h3 className="text-3xl md:text-4xl font-bold text-primary-950 font-serif">
                  {course.name}
                </h3>
                <p className="text-lg text-primary-700 leading-relaxed max-w-4xl mx-auto">
                  {course.description}
                </p>
              </div>

              {/* Drone Flyover Video */}
              <div className="bg-primary-50 rounded-2xl p-6">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-primary-950 font-serif mb-2">
                    Drone Flyover
                  </h4>
                  <p className="text-primary-700 text-sm">
                    Take an aerial journey through {course.name}
                  </p>
                </div>                <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-200 aspect-video">
                  {/* Video temporarily disabled due to file size - will be hosted externally */}
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-100 to-green-200">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l7-5-7-5z" />
                        </svg>
                      </div>
                      <p className="text-green-700 font-medium">Course Overview Video</p>
                      <p className="text-green-600 text-sm">Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>              {/* Course Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hole Diagram - Vertical */}
                <div className={`lg:col-span-1 ${courseIndex === 1 ? 'lg:order-2' : ''}`}>
                  <div className="sticky top-8">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl mb-4" style={{ aspectRatio: '8/11' }}>
                      <img 
                        src={getCurrentImage(courseIndex)} 
                        alt={`${course.name} - Hole ${course.holes[activeHoles[courseIndex]].number}`} 
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Hole Details */}
                <div className={`lg:col-span-2 ${courseIndex === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-primary-50 rounded-2xl p-6 space-y-6">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-primary-950 font-serif mb-2">
                        Hole-by-Hole Details
                      </h4>
                      <p className="text-primary-700 text-sm">
                        Click on any hole number to view details
                      </p>
                    </div>

                    {/* Hole Navigation */}
                    <div className="flex justify-center">
                      <div className="flex space-x-2 bg-white rounded-lg p-2">
                        {course.holes.map((hole, holeIndex) => (
                          <button
                            key={hole.number}
                            onClick={() => handleHoleChange(courseIndex, holeIndex)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                              activeHoles[courseIndex] === holeIndex
                                ? 'bg-primary-950 text-white'
                                : 'bg-gray-100 text-primary-950 hover:bg-primary-100'
                            }`}
                          >
                            {hole.number}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Hole Details */}
                    {(() => {
                      const activeHole = course.holes[activeHoles[courseIndex]]
                      return (
                        <div className="space-y-4">
                          <div className="text-center">
                            <h5 className="text-xl font-bold text-primary-950 font-serif">
                              Hole #{activeHole.number} - Par {activeHole.par}
                            </h5>
                          </div>

                          {/* Yardages */}
                          <div className="bg-white rounded-lg p-4">
                            <h6 className="font-semibold text-primary-950 mb-3 text-center">Yardages</h6>
                            <div className="flex justify-center space-x-4">
                              {activeHole.yardages.map((yardage, index) => (
                                <div key={index} className="flex flex-col items-center space-y-2">
                                  <div 
                                    className={`w-4 h-4 rounded-full ${teeColors[index].color}`}
                                    style={teeColors[index].style || {}}
                                    title={teeColors[index].label}
                                  ></div>
                                  <div className="rounded px-3 py-1 font-bold text-primary-950 text-sm">
                                    {yardage}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>                          {/* Caddie Notes */}
                          <div className="bg-white rounded-lg p-6 border-l-4 border-primary-700 shadow-sm">
                            <div className="flex items-center mb-4">
                              <svg className="w-5 h-5 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              <h6 className="font-semibold text-primary-950 text-base">Caddie Notes</h6>
                            </div>
                            <div className="bg-primary-50 rounded-lg p-4">
                              <p className="text-primary-800 leading-relaxed text-sm italic">
                                "{activeHole.caddieNotes}"
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CoursesDetail