import { Route, Switch } from "wouter";
import Index from "./pages/index";
import ImoveisPage from "./pages/imoveis";
import ImovelPage from "./pages/imovel";
import SobrePage from "./pages/sobre";
import ContatoPage from "./pages/contato";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/imoveis" component={ImoveisPage} />
        <Route path="/imoveis/:id" component={ImovelPage} />
        <Route path="/sobre" component={SobrePage} />
        <Route path="/contato" component={ContatoPage} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
