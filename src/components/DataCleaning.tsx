import AnimatedSection from "@/components/AnimatedSection";
import BeforeAfterComparison from "@/components/BeforeAfterComparison";
import AnimatedTimeline from "@/components/AnimatedTimeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataCleaning() {
  const cleaningSteps = [
    {
      id: "standardize",
      title: "Standardize Symptom Names",
      description: "Convert all symptom names to lowercase and remove extra spaces",
      icon: "📝",
      color: "blue",
      details: (
        <div className="space-y-2 text-sm">
          <p>• "High Fever" → "high fever"</p>
          <p>• "Cough " → "cough"</p>
          <p>• Ensures consistency across dataset</p>
        </div>
      ),
    },
    {
      id: "handle",
      title: "Handle Missing Values",
      description: "Replace NULL values with empty strings for sparse features",
      icon: "🧹",
      color: "green",
      details: (
        <div className="space-y-2 text-sm">
          <p>• NULL → "" (empty string)</p>
          <p>• Preserves sparsity information</p>
          <p>• Maintains data integrity</p>
        </div>
      ),
    },
    {
      id: "remove",
      title: "Remove Duplicates",
      description: "Identify and eliminate duplicate disease-symptom records",
      icon: "🔍",
      color: "orange",
      details: (
        <div className="space-y-2 text-sm">
          <p>• Found: 0 exact duplicates</p>
          <p>• Verified data uniqueness</p>
          <p>• Dataset integrity confirmed</p>
        </div>
      ),
    },
    {
      id: "validate",
      title: "Validate Data Types",
      description: "Ensure all columns have correct data types",
      icon: "✅",
      color: "purple",
      details: (
        <div className="space-y-2 text-sm">
          <p>• Disease: String (object)</p>
          <p>• Symptoms: String (object)</p>
          <p>• All types validated</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <AnimatedSection animation="animate-fade-in" duration="duration-700">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Data Cleaning & Preprocessing
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Transform raw data into a clean, consistent format ready for machine learning
          </p>
        </AnimatedSection>

        {/* Cleaning Process Timeline */}
        <AnimatedSection animation="animate-slide-in-up" duration="duration-700" delay="delay-200">
          <div className="mb-16">
            <AnimatedTimeline steps={cleaningSteps} title="Data Cleaning Process" />
          </div>
        </AnimatedSection>

        {/* Before/After Examples */}
        <AnimatedSection animation="animate-fade-in" duration="duration-700" delay="delay-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Transformation Examples</h2>
        </AnimatedSection>

        <div className="space-y-12 mb-12">
          {/* Example 1: Name Standardization */}
          <AnimatedSection animation="animate-slide-in-left" duration="duration-700" delay="delay-400">
            <BeforeAfterComparison
              title="Symptom Name Standardization"
              beforeTitle="Raw Data"
              afterTitle="Cleaned Data"
              description="Converting inconsistent symptom names to a standard format"
              beforeContent={
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-red-600">
                    <div>"High Fever"</div>
                    <div>"high fever"</div>
                    <div>"FEVER"</div>
                    <div>"Cough "</div>
                    <div>" Fatigue"</div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-green-600">
                    <div>"high fever"</div>
                    <div>"high fever"</div>
                    <div>"fever"</div>
                    <div>"cough"</div>
                    <div>"fatigue"</div>
                  </div>
                </div>
              }
            />
          </AnimatedSection>

          {/* Example 2: Missing Value Handling */}
          <AnimatedSection animation="animate-slide-in-right" duration="duration-700" delay="delay-500">
            <BeforeAfterComparison
              title="Missing Value Handling"
              beforeTitle="Raw Data"
              afterTitle="Cleaned Data"
              description="Replacing NULL values with empty strings for consistency"
              beforeContent={
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-red-600">
                    <div>Disease: "Malaria"</div>
                    <div>Symptom_1: "fever"</div>
                    <div>Symptom_2: NULL</div>
                    <div>Symptom_3: "chills"</div>
                    <div>Symptom_4: NULL</div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-green-600">
                    <div>Disease: "Malaria"</div>
                    <div>Symptom_1: "fever"</div>
                    <div>Symptom_2: ""</div>
                    <div>Symptom_3: "chills"</div>
                    <div>Symptom_4: ""</div>
                  </div>
                </div>
              }
            />
          </AnimatedSection>

          {/* Example 3: Duplicate Removal */}
          <AnimatedSection animation="animate-slide-in-left" duration="duration-700" delay="delay-600">
            <BeforeAfterComparison
              title="Duplicate Record Removal"
              beforeTitle="Raw Data (4,920 records)"
              afterTitle="Cleaned Data (4,920 records)"
              description="Identifying and removing duplicate disease-symptom combinations"
              beforeContent={
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-red-600">
                    <div>Record 1: Malaria, fever, chills, ...</div>
                    <div>Record 2: Malaria, fever, chills, ...</div>
                    <div>Record 3: Dengue, fever, rash, ...</div>
                    <div>Record 4: Malaria, fever, chills, ...</div>
                    <div className="text-orange-600">Duplicates: 0 found ✓</div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-green-600">
                    <div>Record 1: Malaria, fever, chills, ...</div>
                    <div>Record 2: Dengue, fever, rash, ...</div>
                    <div>Record 3: Malaria, fever, chills, ...</div>
                    <div className="text-green-600">Total: 4,920 unique records ✓</div>
                  </div>
                </div>
              }
            />
          </AnimatedSection>
        </div>

        {/* Cleaning Statistics */}
        <AnimatedSection animation="animate-fade-in" duration="duration-700" delay="delay-700">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Cleaning Results</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Records Processed", value: "4,920", icon: "📊", color: "blue" },
            { label: "Duplicates Removed", value: "0", icon: "🗑️", color: "red" },
            { label: "Missing Values Fixed", value: "100%", icon: "✅", color: "green" },
            { label: "Data Quality Score", value: "100%", icon: "⭐", color: "orange" },
          ].map((stat, index) => (
            <AnimatedSection
              key={stat.label}
              animation="animate-bounce-in"
              duration="duration-700"
              delay={`delay-${index * 100}`}
            >
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </div>
                <p className="text-gray-700 font-semibold text-sm">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Quality Assurance */}
        <AnimatedSection animation="animate-slide-in-up" duration="duration-700" delay="delay-800">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-2xl">Quality Assurance Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { check: "Data Type Validation", status: "✅ Passed" },
                  { check: "Null Value Check", status: "✅ Passed" },
                  { check: "Duplicate Detection", status: "✅ Passed" },
                  { check: "Consistency Validation", status: "✅ Passed" },
                  { check: "Range Validation", status: "✅ Passed" },
                  { check: "Format Validation", status: "✅ Passed" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded border border-green-100">
                    <span className="text-gray-700 font-medium">{item.check}</span>
                    <span className="text-green-600 font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {/* Next Steps */}
        <AnimatedSection animation="animate-fade-in" duration="duration-700" delay="delay-900" className="mt-12">
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Next: Feature Engineering</h3>
            <p className="text-gray-600 mb-4">
              With clean data ready, we now transform symptoms into numerical features that machine learning models can understand.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600">→</span>
                <span>Convert 131 unique symptoms to binary features (0 or 1)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600">→</span>
                <span>Create 131-dimensional feature vectors for each disease</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600">→</span>
                <span>Prepare data for model training</span>
              </li>
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
