import { useState } from 'react'
import './App.css'

type Priority = 'low' | 'medium' | 'high'
type PatientPriority = 'normal' | 'important' | 'critical'

type Task = {
  id: number
  patientId: number
  title: string
  due: string
  priority: Priority
  status: 'open' | 'done'
}

type Patient = {
  id: number
  name: string
  bed: string
  mainProblem: string
  priority: PatientPriority
}

type Screen = { name: 'today' } | { name: 'patients' } | { name: 'patientDetail'; patientId: number }

const initialPatients: Patient[] = [
  { id: 1, name: 'John Doe', bed: '12A', mainProblem: 'Sepsis secondary to pneumonia', priority: 'critical' },
  { id: 2, name: 'Maria Garcia', bed: '7B', mainProblem: 'Decompensated heart failure', priority: 'important' },
  { id: 3, name: 'Ahmed Khan', bed: '3C', mainProblem: 'Uncontrolled diabetes', priority: 'normal' },
]

const initialTasks: Task[] = [
  { id: 1, patientId: 1, title: 'Recheck lactate', due: 'Today · in 4h', priority: 'high', status: 'open' },
  { id: 2, patientId: 1, title: 'Review blood culture results', due: 'Today · evening', priority: 'medium', status: 'open' },
  { id: 3, patientId: 2, title: 'Follow up echo report', due: 'Overdue', priority: 'high', status: 'open' },
  { id: 4, patientId: 2, title: 'Adjust diuretics', due: 'Today · afternoon', priority: 'medium', status: 'open' },
  { id: 5, patientId: 3, title: 'Review glucose log', due: 'Tomorrow', priority: 'low', status: 'open' },
  { id: 6, patientId: 3, title: 'Check HbA1c result', due: 'Tomorrow', priority: 'medium', status: 'open' },
]

function priorityBadge(priority: Priority) {
  if (priority === 'high') return '🔥 High'
  if (priority === 'medium') return '⬆️ Medium'
  return '⬇️ Low'
}

function patientPriorityBadge(priority: PatientPriority) {
  if (priority === 'critical') return 'Critical'
  if (priority === 'important') return 'Important'
  return 'Normal'
}

function TodayQueue({
  tasks,
  patients,
  onOpenPatient,
}: {
  tasks: Task[]
  patients: Patient[]
  onOpenPatient: (patientId: number) => void
}) {
  const sorted = [...tasks].sort((a, b) => {
    const overdueA = a.due.toLowerCase().includes('overdue')
    const overdueB = b.due.toLowerCase().includes('overdue')
    if (overdueA !== overdueB) return overdueA ? -1 : 1
    const order: Priority[] = ['high', 'medium', 'low']
    return order.indexOf(a.priority) - order.indexOf(b.priority)
  })

  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Today queue</h1>
      </header>
      <main className="screen-body">
        {sorted.map((task) => {
          const patient = patients.find((p) => p.id === task.patientId)!
          return (
            <button
              key={task.id}
              className="list-row task-row"
              onClick={() => onOpenPatient(patient.id)}
            >
              <div className="row-main">
                <div className="row-title">
                  <span className="patient-name">{patient.name}</span>
                  {patient.priority === 'critical' && <span className="chip chip-critical">Critical</span>}
                </div>
                <div className="row-subtitle">{task.title}</div>
              </div>
              <div className="row-meta">
                <div className="due">{task.due}</div>
                <div className={`priority priority-${task.priority}`}>{priorityBadge(task.priority)}</div>
              </div>
            </button>
          )
        })}
      </main>
    </div>
  )
}

function PatientsList({
  patients,
  tasks,
  onOpenPatient,
}: {
  patients: Patient[]
  tasks: Task[]
  onOpenPatient: (patientId: number) => void
}) {
  return (
    <div className="screen">
      <header className="screen-header">
        <h1>Patients</h1>
      </header>
      <main className="screen-body">
        {patients.map((p) => {
          const openTasksCount = tasks.filter((t) => t.patientId === p.id && t.status === 'open').length
          return (
            <button
              key={p.id}
              className="list-row"
              onClick={() => onOpenPatient(p.id)}
            >
              <div className="row-main">
                <div className="row-title">
                  <span className="patient-name">{p.name}</span>
                  <span className="chip">{patientPriorityBadge(p.priority)}</span>
                </div>
                <div className="row-subtitle">
                  Bed {p.bed} · {p.mainProblem}
                </div>
              </div>
              <div className="row-meta">
                <span className="tasks-count">{openTasksCount} open</span>
              </div>
            </button>
          )
        })}
      </main>
    </div>
  )
}

function PatientDetail({
  patientId,
  patients,
  tasks,
  onBack,
  onAddTask,
}: {
  patientId: number
  patients: Patient[]
  tasks: Task[]
  onBack: () => void
  onAddTask: (patientId: number, title: string) => void
}) {
  const patient = patients.find((p) => p.id === patientId)!
  const openTasks = tasks.filter((t) => t.patientId === patientId && t.status === 'open')
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = () => {
    if (!newTitle.trim()) return
    onAddTask(patientId, newTitle.trim())
    setNewTitle('')
  }

  return (
    <div className="screen">
      <header className="screen-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <div>
          <h1>{patient.name}</h1>
          <div className="header-sub">
            Bed {patient.bed} · {patient.mainProblem} ·{' '}
            <span className="chip">{patientPriorityBadge(patient.priority)}</span>
          </div>
        </div>
      </header>
      <main className="screen-body">
        <section>
          <h2>Open tasks</h2>
          {openTasks.map((task) => (
            <div key={task.id} className="list-row task-row">
              <div className="row-main">
                <div className="row-subtitle">{task.title}</div>
              </div>
              <div className="row-meta">
                <div className="due">{task.due}</div>
                <div className={`priority priority-${task.priority}`}>{priorityBadge(task.priority)}</div>
              </div>
            </div>
          ))}
        </section>
        <section className="add-task-section">
          <h2>Add task (local only)</h2>
          <input
            type="text"
            className="input"
            placeholder="e.g. Check K+ in 4h"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="primary-button" onClick={handleAdd}>
            Add
          </button>
        </section>
      </main>
    </div>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'today' })
  const [patients] = useState<Patient[]>(initialPatients)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const goToPatient = (patientId: number) => setScreen({ name: 'patientDetail', patientId })

  const handleAddTask = (patientId: number, title: string) => {
    const nextId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1
    const newTask: Task = {
      id: nextId,
      patientId,
      title,
      due: 'Today',
      priority: 'medium',
      status: 'open',
    }
    setTasks((prev) => [...prev, newTask])
  }

  return (
    <div className="app-shell">
      {screen.name === 'today' && (
        <TodayQueue tasks={tasks} patients={patients} onOpenPatient={goToPatient} />
      )}
      {screen.name === 'patients' && (
        <PatientsList patients={patients} tasks={tasks} onOpenPatient={goToPatient} />
      )}
      {screen.name === 'patientDetail' && (
        <PatientDetail
          patientId={screen.patientId}
          patients={patients}
          tasks={tasks}
          onAddTask={handleAddTask}
          onBack={() => setScreen({ name: 'today' })}
        />
      )}
      <nav className="tab-bar">
        <button
          className={`tab-item ${screen.name === 'today' ? 'tab-item-active' : ''}`}
          onClick={() => setScreen({ name: 'today' })}
        >
          Today
        </button>
        <button
          className={`tab-item ${screen.name === 'patients' ? 'tab-item-active' : ''}`}
          onClick={() => setScreen({ name: 'patients' })}
        >
          Patients
        </button>
      </nav>
    </div>
  )
}

export default App
