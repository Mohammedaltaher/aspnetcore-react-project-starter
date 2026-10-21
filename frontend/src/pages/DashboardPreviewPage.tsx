import { ClipboardList, CreditCard, MoreVertical, Pencil, Scissors, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'

const metrics = [
  { label: 'Appointments', value: '680.00', color: 'coral', icon: ClipboardList, points: '0,30 7,23 13,26 19,17 27,20 33,18 39,5 46,7 53,13 59,3 64,2 70,17 77,14 85,19 91,17 99,22 107,30' },
  { label: 'Operations', value: '170.00', color: 'orange', icon: Scissors, points: '0,26 8,17 14,21 20,13 28,18 37,11 45,17 53,6 59,15 65,5 70,19 76,11 83,20 91,15 99,23 107,28' },
  { label: 'New Patients', value: '280.00', color: 'teal', icon: UserRound, points: '0,28 8,20 14,24 22,13 28,28 35,11 42,12 48,25 55,3 62,13 69,11 75,21 82,14 90,13 98,21 107,29' },
  { label: 'Earning', value: '$ 1286.00', color: 'blue', icon: CreditCard, points: '0,29 7,21 13,24 20,16 27,24 33,8 40,4 47,20 54,2 60,19 67,4 74,24 81,13 87,19 95,17 101,28 107,31' },
]

const appointments = [
  { doctor: 'Dr.Allison Curtis', avatar: 'allison', patient: 'Makenna Press', date: '18/04/2023', disease: 'Allergies' },
  { doctor: 'Dr.Zaire Herwitz', avatar: 'zaire', patient: 'Lincoln Lubin', date: '21/04/2023', disease: 'Headaches' },
  { doctor: 'Dr.Maria Culha', avatar: 'maria', patient: 'Tiana Bator', date: '24/04/2023', disease: 'Allergies' },
  { doctor: 'Dr.Giana Botos', avatar: 'giana', patient: 'Paityn Lipshutz', date: '26/04/2023', disease: 'Allergies' },
]

const doctors = [
  { name: 'Dr.Ruben Bothman', avatar: 'ruben', detail: 'MS(Gen Surgery), FRCS(L), FRCS(G), DNB', status: 'Available' },
  { name: 'Dr.Kierra GA', avatar: 'kierra', detail: 'MBBS, DCH, MD, DM (Neurology)', status: 'Absend' },
  { name: 'Dr.Anika Septimus', avatar: 'anika', detail: 'MS(ENT), DLO, DA', status: 'Available' },
  { name: 'Dr.Jakob Passai', avatar: 'jakob', detail: 'MD, DM, FRCP (UK), FSCAI', status: 'Available' },
]

const bars = [[1.1, 0.65, 0.65], [1.4, 0.75, 0.65], [2.35, 1, 1.65], [1.2, 0.65, 1.65], [1.55, 0.8, 0.5], [1.45, 1.2, 1.85], [2.3, 0.8, 0.9]]
const days = ['10 Apr', '11 Apr', '12 Apr', '13 Apr', '14 Apr', '15 Apr', '16 Apr']

function Sparkline({ points }: { points: string }) {
  return <svg className="reference-sparkline" viewBox="0 0 107 38" aria-hidden="true"><polyline points={points} fill="none" stroke="#6f94ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SurveyChart() {
  return <div className="survey-chart" role="img" aria-label="Hospital survey from 10 through 16 April: new and old patients">
    <div className="chart-y-labels">{['05', '04', '03', '02', '01', '00'].map(value => <span key={value}>{value}</span>)}</div>
    <div className="survey-plot">
      <svg viewBox="0 0 560 190" preserveAspectRatio="none" aria-hidden="true">
        {[0, 38, 76, 114, 152, 189].map(y => <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="#d4d4d4" strokeDasharray="2 3" />)}
        <path d="M0 111 C25 153 44 165 67 140 S102 81 131 96 S169 151 201 143 S242 120 267 126 S309 159 342 146 S374 117 402 127 S430 153 457 141 S482 126 506 139 S531 127 545 138 S555 136 560 128" fill="none" stroke="#8576ff" strokeWidth="3" strokeLinecap="round" />
        <path d="M0 149 C24 119 46 93 78 97 S119 121 150 126 S174 96 205 88 S234 98 258 72 S285 39 310 43 S337 76 366 57 S388 23 415 31 S444 42 452 58 S465 65 482 73 S506 109 528 101 S548 69 560 72" fill="none" stroke="#ff5d73" strokeWidth="3" strokeLinecap="round" />
        <line x1="280" x2="280" y1="0" y2="189" stroke="#d9d9d9" strokeDasharray="2 3" />
      </svg>
      <div className="survey-tooltip"><strong>13 Apr</strong><span><i className="legend-dot legend-purple" />New Patients <b>52</b></span><span><i className="legend-dot legend-coral" />Old Patients <b>44</b></span></div>
      <div className="chart-x-labels">{days.map(day => <span key={day}>{day}</span>)}</div>
    </div>
  </div>
}

function DiseaseChart() {
  return <div className="disease-chart" role="img" aria-label="Common diseases report from 10 through 16 April">
    <div className="chart-y-labels">{['05', '04', '03', '02', '01', '00'].map(value => <span key={value}>{value}</span>)}</div>
    <div className="disease-plot"><div className="disease-grid" />
      <div className="disease-bars">{bars.map((segments, index) => <div className="disease-bar-column" key={days[index]}><div className="disease-bar-stack" style={{ height: `${(segments.reduce((a, b) => a + b, 0) / 5) * 100}%` }}><span style={{ flex: segments[0] }} /><span style={{ flex: segments[1] }} /><span style={{ flex: segments[2] }} /></div></div>)}</div>
      <div className="disease-tooltip"><strong>13 Apr</strong><span><i className="legend-dot legend-mid" />Allergies <b>52</b></span></div>
      <div className="chart-x-labels">{days.map(day => <span key={day}>{day}</span>)}</div>
    </div>
  </div>
}

export function DashboardPreviewPage() {
  const [surveyPeriod, setSurveyPeriod] = useState('10 - 16 Apr -2023')
  const [diseasePeriod, setDiseasePeriod] = useState('10 - 16 Apr -2023')
  return <main className="page reference-dashboard">
    <section className="reference-metrics" aria-label="Hospital metrics">{metrics.map(metric => { const Icon = metric.icon; return <article className="reference-metric" key={metric.label}>
      <span className={`reference-metric-icon icon-${metric.color}`}><Icon size={24} strokeWidth={1.8} /></span>
      <div className="reference-metric-info"><div><p>{metric.label}</p><strong>{metric.value}</strong></div><Sparkline points={metric.points} /></div>
    </article> })}</section>

    <div className="reference-charts">
      <section className="reference-panel"><div className="reference-panel-heading"><div><h2>Hospital Survey</h2><div className="reference-legend"><span><i className="legend-dot legend-purple" />New Patients</span><span><i className="legend-dot legend-coral" />Old Patients</span></div></div><select aria-label="Hospital survey period" value={surveyPeriod} onChange={event => setSurveyPeriod(event.target.value)}><option>10 - 16 Apr -2023</option><option>17 - 23 Apr -2023</option></select></div><SurveyChart /></section>
      <section className="reference-panel"><div className="reference-panel-heading"><div><h2>Common Diseases Report</h2><div className="reference-legend"><span><i className="legend-dot legend-light" />Colds and Flu</span><span><i className="legend-dot legend-mid" />Allergies</span><span><i className="legend-dot legend-deep" />Headaches</span></div></div><select aria-label="Common diseases period" value={diseasePeriod} onChange={event => setDiseasePeriod(event.target.value)}><option>10 - 16 Apr -2023</option><option>17 - 23 Apr -2023</option></select></div><DiseaseChart /></section>
    </div>

    <div className="reference-tables">
      <section className="reference-panel reference-table-panel"><div className="reference-panel-heading"><h2>Booked Appointment</h2><MoreVertical size={24} /></div><div className="reference-table-scroll"><table><thead><tr><th>Assigned Doctor</th><th>Patient Name</th><th>Date</th><th>Diseases</th><th>Actions</th></tr></thead><tbody>{appointments.map(appointment => <tr key={appointment.doctor}><td><span className="reference-person"><span className={`reference-avatar avatar-${appointment.avatar}`} aria-hidden="true" />{appointment.doctor}</span></td><td>{appointment.patient}</td><td>{appointment.date}</td><td>{appointment.disease}</td><td><span className="reference-row-actions" aria-label="Preview actions"><Pencil size={21} /><Trash2 size={21} /></span></td></tr>)}</tbody></table></div></section>
      <section className="reference-panel reference-table-panel"><div className="reference-panel-heading"><h2>Doctors List</h2><MoreVertical size={24} /></div><div className="reference-table-scroll"><table><thead><tr><th>Doctor Name</th><th>Status</th></tr></thead><tbody>{doctors.map(doctor => <tr key={doctor.name}><td><span className="reference-person"><span className={`reference-avatar avatar-${doctor.avatar}`} aria-hidden="true" /><span>{doctor.name}<small>{doctor.detail}</small></span></span></td><td><span className={`doctor-status ${doctor.status === 'Available' ? 'available' : 'absent'}`}><i />{doctor.status}</span></td></tr>)}</tbody></table></div></section>
    </div>
    <p className="sr-only">This is sample dashboard data for visual preview. The Customers module is connected to the API after sign in.</p>
  </main>
}
