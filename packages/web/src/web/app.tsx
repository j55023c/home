import { Route, Switch } from "wouter";
import Index from "./pages/index";
import ImoveisPage from "./pages/imoveis";
import ImovelPage from "./pages/imovel";
import SobrePage from "./pages/sobre";
import ContatoPage from "./pages/contato";
import { Provider } from "./components/provider";

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
    </Provider>
  );
}

export default App;
