import { useState } from 'react'
import { TopNav } from './components/TopNav'
import { Sidebar } from './components/Sidebar'
import { ChatArea } from './components/ChatArea'
import { CoinTossScreen } from './components/CoinTossScreen'
import { RightPanel } from './components/RightPanel'
import { useApp } from './hooks/useApp'

export function App() {
  const [topTab, setTopTab] = useState('cast')

  const {
    sessions,
    activeSession,
    coinStepIndex,
    pendingCoinLines,
    createNewSession,
    setActiveSession,
    deleteSession,
    sendQuestion,
    chooseMethod,
    tossCoinStep,
    cancelCoinToss,
    autoCompleteCoinToss
  } = useApp()

  const isCasting = activeSession?.state === 'casting'

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

        {isCasting && activeSession ? (
          <CoinTossScreen
            question={activeSession.question}
            stepIndex={coinStepIndex}
            completedLines={pendingCoinLines}
            onToss={tossCoinStep}
            onCancel={cancelCoinToss}
            onAutoComplete={autoCompleteCoinToss}
          />
        ) : (
          <ChatArea
            session={activeSession}
            onSendQuestion={sendQuestion}
            onChooseMethod={chooseMethod}
            onNewSession={createNewSession}
          />
        )}

        <RightPanel castResult={activeSession?.castResult ?? null} />
      </div>
    </div>
  )
}
