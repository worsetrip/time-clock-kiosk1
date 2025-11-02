"use client"

import { useState, useEffect } from "react"
import { Menu, Search, Delete } from "lucide-react"
import DVIForm from "@/components/dvi-form"

type ViewState = "login" | "employeeIdEntry" | "dvi" | "clockout" | "complete"

export default function TimeClockKiosk() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [view, setView] = useState<ViewState>("login")
  const [enteredId, setEnteredId] = useState("")
  const [employeeData, setEmployeeData] = useState({
    name: "",
    id: "",
    clockedIn: false,
    dviCompleted: false,
    clockInTime: "",
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Simulate ID card login
  const handleIdCardLogin = () => {
    console.log("[v0] ID Card Login initiated")
    // Simulate card read - in production this would come from card reader
    const mockEmployee = {
      name: "John Driver",
      id: "EMP12345",
      clockedIn: false,
      dviCompleted: false,
      clockInTime: "",
    }

    authenticateEmployee(mockEmployee)
  }

  const handleEmployeeIdLogin = () => {
    console.log("[v0] Manual Employee ID Login initiated")
    setView("employeeIdEntry")
    setEnteredId("")
  }

  const handleKeypadPress = (digit: string) => {
    if (enteredId.length < 10) {
      setEnteredId(enteredId + digit)
    }
  }

  const handleClear = () => {
    setEnteredId("")
  }

  const handleBackspace = () => {
    setEnteredId(enteredId.slice(0, -1))
  }

  const handleSubmitEmployeeId = () => {
    if (enteredId.length > 0) {
      // In production, this would validate against a database
      const mockEmployee = {
        name: "Jane Operator",
        id: enteredId,
        clockedIn: false,
        dviCompleted: false,
        clockInTime: "",
      }
      authenticateEmployee(mockEmployee)
    }
  }

  const handleCancelIdEntry = () => {
    setView("login")
    setEnteredId("")
  }

  const authenticateEmployee = (employee: typeof employeeData) => {
    console.log("[v0] Authenticating employee:", employee.id)
    setEmployeeData(employee)

    // Check if already clocked in
    if (!employee.clockedIn) {
      // Clock them in and show DVI form
      const clockInTime = formatTime(new Date())
      setEmployeeData((prev) => ({
        ...prev,
        clockedIn: true,
        clockInTime,
      }))
      setView("dvi")
      console.log("[v0] Employee clocked in at:", clockInTime)
    } else if (!employee.dviCompleted) {
      // Already clocked in but DVI not done
      setView("dvi")
      console.log("[v0] Showing DVI form - not yet completed")
    } else {
      // Already clocked in and DVI done - show clock out
      setView("clockout")
      console.log("[v0] Showing clock out option")
    }
  }

  const handleDviComplete = () => {
    console.log("[v0] DVI form completed")
    setEmployeeData((prev) => ({ ...prev, dviCompleted: true }))
    setView("complete")

    // Auto-return to login after 3 seconds
    setTimeout(() => {
      setView("login")
      setEmployeeData({
        name: "",
        id: "",
        clockedIn: false,
        dviCompleted: false,
        clockInTime: "",
      })
    }, 3000)
  }

  const handleClockOut = () => {
    console.log("[v0] Employee clocked out")
    setView("complete")

    // Auto-return to login after 3 seconds
    setTimeout(() => {
      setView("login")
      setEmployeeData({
        name: "",
        id: "",
        clockedIn: false,
        dviCompleted: false,
        clockInTime: "",
      })
    }, 3000)
  }

  if (view === "dvi") {
    return (
      <div className="min-h-screen bg-[#D3D3D3] flex flex-col">
        {/* Header */}
        <header className="bg-[#E31E24] px-6 py-4 flex items-center gap-4">
          <button className="text-white">
            <Menu size={32} />
          </button>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1 bg-white rounded px-4 py-2 flex items-center gap-2">
              <Search size={20} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="flex-1 outline-none text-lg" />
            </div>
            <button className="bg-[#FFE500] text-black px-8 py-2 rounded font-bold text-lg hover:bg-yellow-400">
              BUTTON 1
            </button>
            <button className="bg-[#FFE500] text-black px-8 py-2 rounded font-bold text-lg hover:bg-yellow-400">
              BUTTON 2
            </button>
            <button className="bg-[#FFE500] text-black px-8 py-2 rounded font-bold text-lg hover:bg-yellow-400">
              BUTTON 3
            </button>
          </div>
          <div className="text-white text-right">
            <div className="text-sm">Score</div>
            <div className="text-2xl font-bold">95</div>
          </div>
        </header>

        {/* Employee Info Banner */}
        <div className="bg-[#E31E24] text-white px-6 py-3 text-center">
          <div className="text-xl font-bold">
            {employeeData.name} - {employeeData.id} - Clocked In: {employeeData.clockInTime}
          </div>
        </div>

        {/* DVI Form with custom submit handler */}
        <div className="flex-1 overflow-auto">
          <DVIFormWrapper onComplete={handleDviComplete} />
        </div>

        {/* Footer */}
        <footer className="bg-[#1A1A1A] text-white py-4 text-center">
          <div className="text-xl font-bold">VISI2N by Transdev</div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#D3D3D3] flex flex-col">
      {/* Header */}
      <header className="bg-[#E31E24] px-6 py-4 flex items-center gap-4">
        <button className="text-white">
          <Menu size={32} />
        </button>
        <div className="flex-1 flex items-center gap-4">
          <div className="flex-1 bg-white rounded px-4 py-2 flex items-center gap-2">
            <Search size={20} className="text-gray-400" />
            <input type="text" placeholder="Search..." className="flex-1 outline-none text-lg" />
          </div>
          <button className="bg-[#FFE500] text-black px-8 py-2 rounded font-bold text-lg hover:bg-yellow-400">
            BUTTON 1
          </button>
          <button className="bg-[#FFE500] text-black px-8 py-2 rounded font-bold text-lg hover:bg-yellow-400">
            BUTTON 2
          </button>
          <button className="bg-[#FFE500] text-black px-8 py-2 rounded font-bold text-lg hover:bg-yellow-400">
            BUTTON 3
          </button>
        </div>
        <div className="text-white text-right">
          <div className="text-sm">Score</div>
          <div className="text-2xl font-bold">95</div>
        </div>
      </header>

      {/* Station ID Banner */}
      <div className="bg-[#E31E24] text-white px-6 py-3 text-center">
        <div className="text-xl font-bold">STATION ID: KIOSK-001</div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        {view === "login" && (
          <div className="w-full max-w-4xl">
            {/* Clock Display */}
            <div className="bg-[#1A1A1A] rounded-3xl p-12 mb-8 shadow-2xl">
              <div className="text-center">
                <div className="text-white text-8xl font-bold font-mono tracking-wider mb-4">
                  {formatTime(currentTime)}
                </div>
                <div className="text-gray-400 text-2xl font-semibold">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Login Buttons */}
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={handleIdCardLogin}
                className="bg-[#E31E24] text-white rounded-2xl py-16 text-4xl font-bold hover:bg-red-700 transition-colors shadow-xl"
              >
                ID CARD LOGIN
              </button>
              <button
                onClick={handleEmployeeIdLogin}
                className="bg-[#FFE500] text-black rounded-2xl py-16 text-4xl font-bold hover:bg-yellow-400 transition-colors shadow-xl"
              >
                EMPLOYEE ID
              </button>
            </div>
          </div>
        )}

        {view === "employeeIdEntry" && (
          <div className="w-full max-w-4xl">
            {/* ID Display */}
            <div className="bg-[#1A1A1A] rounded-3xl p-12 mb-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-gray-400 text-2xl mb-4">Enter Employee ID</div>
                <div className="bg-white rounded-xl p-6 min-h-[100px] flex items-center justify-center">
                  <div className="text-6xl font-bold font-mono tracking-widest text-black">{enteredId || "—"}</div>
                </div>
              </div>
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleKeypadPress(digit.toString())}
                  className="bg-white text-black rounded-2xl py-12 text-5xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="bg-[#E31E24] text-white rounded-2xl py-12 text-3xl font-bold hover:bg-red-700 transition-colors shadow-lg"
              >
                CLEAR
              </button>
              <button
                onClick={() => handleKeypadPress("0")}
                className="bg-white text-black rounded-2xl py-12 text-5xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
              >
                0
              </button>
              <button
                onClick={handleBackspace}
                className="bg-gray-600 text-white rounded-2xl py-12 flex items-center justify-center hover:bg-gray-700 transition-colors shadow-lg"
              >
                <Delete size={48} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={handleCancelIdEntry}
                className="bg-gray-600 text-white rounded-2xl py-12 text-3xl font-bold hover:bg-gray-700 transition-colors shadow-lg"
              >
                CANCEL
              </button>
              <button
                onClick={handleSubmitEmployeeId}
                disabled={enteredId.length === 0}
                className="bg-[#FFE500] text-black rounded-2xl py-12 text-3xl font-bold hover:bg-yellow-400 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}

        {view === "clockout" && (
          <div className="w-full max-w-4xl text-center">
            <div className="bg-[#1A1A1A] rounded-3xl p-12 mb-8 shadow-2xl">
              <div className="text-white text-5xl font-bold mb-6">Welcome Back, {employeeData.name}!</div>
              <div className="text-gray-400 text-2xl mb-4">Clocked In: {employeeData.clockInTime}</div>
              <div className="text-green-400 text-xl">✓ DVI Completed</div>
            </div>

            <button
              onClick={handleClockOut}
              className="bg-[#E31E24] text-white rounded-2xl py-16 px-24 text-4xl font-bold hover:bg-red-700 transition-colors shadow-xl"
            >
              CLOCK OUT
            </button>
          </div>
        )}

        {view === "complete" && (
          <div className="w-full max-w-4xl text-center">
            <div className="bg-[#1A1A1A] rounded-3xl p-16 shadow-2xl">
              <div className="text-green-400 text-6xl font-bold mb-6">✓ SUCCESS</div>
              <div className="text-white text-3xl">Thank you, {employeeData.name}!</div>
              <div className="text-gray-400 text-xl mt-4">Returning to login screen...</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-4 text-center">
        <div className="text-xl font-bold">VISI2N by Transdev</div>
      </footer>
    </div>
  )
}

// Wrapper component to override DVI form submit behavior
function DVIFormWrapper({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Override the form's submit button behavior
    const handleSubmit = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.textContent?.includes("Submit Inspection")) {
        e.preventDefault()
        onComplete()
      }
    }

    document.addEventListener("click", handleSubmit)
    return () => document.removeEventListener("click", handleSubmit)
  }, [onComplete])

  return <DVIForm />
}
