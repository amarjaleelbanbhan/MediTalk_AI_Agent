import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dataset() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dataset Overview</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Statistics</CardTitle>
              <CardDescription>Comprehensive medical dataset for disease-symptom mapping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-blue-600 mb-2">4,920</div>
                  <p className="text-gray-700 font-semibold">Total Records</p>
                  <p className="text-sm text-gray-600">Disease-symptom combinations</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">41</div>
                  <p className="text-gray-700 font-semibold">Unique Diseases</p>
                  <p className="text-sm text-gray-600">Medical conditions covered</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">131</div>
                  <p className="text-gray-700 font-semibold">Unique Symptoms</p>
                  <p className="text-sm text-gray-600">Medical indicators</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="text-4xl font-bold text-orange-600 mb-2">5-10</div>
                  <p className="text-gray-700 font-semibold">Avg Symptoms/Disease</p>
                  <p className="text-sm text-gray-600">Per disease record</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">dataset.csv</h4>
                  <p className="text-sm text-gray-600">Main symptom-disease dataset with 4,920 records and up to 17 symptom columns per disease</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">symptom_Description.csv</h4>
                  <p className="text-sm text-gray-600">Detailed descriptions for all 41 diseases</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">symptom_precaution.csv</h4>
                  <p className="text-sm text-gray-600">Precaution recommendations for each disease</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Symptom-severity.csv</h4>
                  <p className="text-sm text-gray-600">Severity weights for 135 symptoms (optional for weighted predictions)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Data Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The main dataset follows this structure with disease names in the first column and symptoms in subsequent columns:
              </p>
              <div className="overflow-x-auto bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                <pre>{`| Disease         | Symptom_1    | Symptom_2   | Symptom_3  | ... | Symptom_17 |
|-----------------|--------------|-------------|------------|-----|------------|
| Fungal inf...   | itching      | skin_rash   | nodal_ski..| ... | NULL       |
| Diabetes        | fatigue      | weight_loss | restlessn..| ... | NULL       |
| Malaria         | high_fever   | chills      | headache   | ... | NULL       |
| Common Cold     | cough        | runny_nose  | sneezing   | ... | NULL       |`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diseases Covered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Allergy</p>
                  <p>• Acne</p>
                  <p>• AIDS</p>
                  <p>• Alcoholic hepatitis</p>
                  <p>• Arthritis</p>
                  <p>• Bronchial Asthma</p>
                  <p>• Cervical spondylosis</p>
                  <p>• Chicken pox</p>
                  <p>• Chronic cholestasis</p>
                  <p>• Common Cold</p>
                  <p>• Dengue</p>
                  <p>• Diabetes</p>
                  <p>• Dimorphic hemorrhoids</p>
                  <p>• Drug Reaction</p>
                  <p>• GERD</p>
                  <p>• Fungal infection</p>
                  <p>• Gastroenteritis</p>
                  <p>• Heart attack</p>
                  <p>• Hepatitis A/B/C/D/E</p>
                  <p>• Hyperthyroidism</p>
                  <p>• Hypothyroidism</p>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Hypertension</p>
                  <p>• Impetigo</p>
                  <p>• Jaundice</p>
                  <p>• Malaria</p>
                  <p>• Migraine</p>
                  <p>• Osteoarthritis</p>
                  <p>• Paralysis</p>
                  <p>• Peptic ulcer disease</p>
                  <p>• Pneumonia</p>
                  <p>• Psoriasis</p>
                  <p>• Tuberculosis</p>
                  <p>• Typhoid</p>
                  <p>• Urinary tract infection</p>
                  <p>• Varicose veins</p>
                  <p>• (Vertigo) Paroxysmal Positional Vertigo</p>
                  <p>• And more...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Loading Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The data loading pipeline reads all four CSV files and prepares them for machine learning:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Load CSV Files:</strong> Read all four data files into memory</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>Extract Symptoms:</strong> Collect all unique symptoms from symptom columns</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Clean Names:</strong> Standardize symptom and disease names (lowercase, underscores)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Create Vocabulary:</strong> Build comprehensive lists of symptoms and diseases</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span className="text-gray-700"><strong>Sort Alphabetically:</strong> Ensure consistent ordering for reproducibility</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
