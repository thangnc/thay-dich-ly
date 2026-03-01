import { useState } from 'react'
import { TopNav } from './components/TopNav'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { RightPanel } from './components/RightPanel'
import { useApp } from './hooks/useApp'

export function App() {
  const [topTab, setTopTab] = useState('cast')

  const {
    sessions,
    activeSession,
    isLoading,
    coinStepIndex,
    createNewSession,
    setActiveSession,
    deleteSession,
    sendQuestion,
    chooseMethod,
    tossCoinStep
  } = useApp()

  return (
    <div className="app-layout">
      <TopNav activeTab={topTab} onTabChange={setTopTab} />

      <div className="app-body">
        <Sidebar
          sessions={sessions}
          activeSession={activeSession}
          onNew={createNewSession}
          onSelect={setActiveSession}
          onDelete={deleteSession}
        />

        <ChatArea
          session={activeSession}
          coinStepIndex={coinStepIndex}
          onSendQuestion={sendQuestion}
          onChooseMethod={chooseMethod}
          onTossCoinStep={tossCoinStep}
          onNewSession={createNewSession}
        />

        <RightPanel castResult={activeSession?.castResult ?? null} />
      </div>
    </div>
  )
}
