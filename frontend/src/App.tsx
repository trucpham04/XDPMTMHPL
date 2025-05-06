import RoutesComponent from "@/routes/index";
import { useNotificationWebSocketContext } from "@/contexts/NotificationWebSocketContext";

function App() {
  useNotificationWebSocketContext();

  return <RoutesComponent />;
}

export default App;
