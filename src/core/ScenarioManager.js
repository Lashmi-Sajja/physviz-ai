// Core scenario management system
export class ScenarioManager {
  constructor() {
    this.scenarios = new Map();
    this.currentScenario = null;
  }

  register(scenario) {
    this.scenarios.set(scenario.id, scenario);
  }

  detect(problemText) {
    for (const [id, scenario] of this.scenarios) {
      if (scenario.matches(problemText)) {
        return id;
      }
    }
    return null;
  }

  load(scenarioId, params) {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) throw new Error(`Scenario ${scenarioId} not found`);
    this.currentScenario = scenario.create(params);
    return this.currentScenario;
  }

  update(dt) {
    if (this.currentScenario) {
      this.currentScenario.update(dt);
    }
  }

  render(ctx) {
    if (this.currentScenario) {
      this.currentScenario.render(ctx);
    }
  }

  getInsights() {
    return this.currentScenario?.getInsights() || [];
  }

  getWhatIf() {
    return this.currentScenario?.getWhatIf() || [];
  }
}
