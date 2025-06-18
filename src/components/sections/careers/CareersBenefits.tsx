import { 
  Heart, 
  Shield,
  DollarSign,
  Calendar,
  Users,
  Trophy 
} from 'lucide-react'

const CareersBenefits = () => {  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      items: [
        "Medical, Dental and Vision Insurance",
        "Company paid Life Insurance & Accidental Death & Dismemberment Coverage of $10,000",
        "Company paid Long Term disability",
        "Short Term disability",
        "Option to purchase additional Life and AD&D Coverage",
        "HSA Account"
      ]    },
    {
      icon: DollarSign,
      title: "Financial Benefits",
      items: [
        "401K with company match",
        "Employee Discounts",
        "Competitive compensation packages"
      ]    },
    {
      icon: Calendar,
      title: "Time Off & Flexibility",
      items: [
        "Vacation Time (Full Time Year Round Employees)",
        "Flexible scheduling options",
        "Work-life balance support"
      ]    },
    {
      icon: Users,
      title: "Employee Perks",
      items: [
        "Employee Meals",
        "Free Golf",
        "Access to club facilities",
        "Team building activities"
      ]    },
    {
      icon: Trophy,
      title: "Professional Development",
      items: [
        "Career advancement opportunities",
        "Training and development programs",
        "Mentorship opportunities",
        "Skills development support"
      ]    },
    {
      icon: Shield,
      title: "Security & Stability",
      items: [
        "Stable employment with established company",
        "Clear career progression paths",
        "Supportive work environment",
        "Recognition programs"
      ]
    }
  ]

  return (
    <section className="py-20 bg-primary-50">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
            Employee Benefits
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We believe in taking care of our team members with comprehensive benefits 
            and perks that support both their professional and personal well-being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <benefit.icon className="w-8 h-8 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-primary-950">
                  {benefit.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {benefit.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 text-sm flex items-start">
                    <span className="w-2 h-2 bg-primary-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>        <div className="text-center mt-12">
          <div className="bg-white rounded-lg p-8 shadow-md max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold font-serif text-primary-950 mb-4">
              Ready to Join Our Team?
            </h3>
            <p className="text-gray-700 mb-6">
              Take the next step in your career and become part of the Birchwood family. 
              We're always looking for passionate individuals who share our commitment to excellence.
            </p>
            <button 
              onClick={() => {
                const applicationsSection = document.getElementById('careers-applications');
                if (applicationsSection) {
                  const applicationsTop = applicationsSection.offsetTop;
                  window.scrollTo({
                    top: applicationsTop,
                    behavior: 'smooth'
                  });
                }
              }}
              className="btn-primary inline-block"
            >
              View Job Openings
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareersBenefits
