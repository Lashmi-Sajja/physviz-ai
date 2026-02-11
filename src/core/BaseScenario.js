// Base class for all physics scenarios
export class BaseScenario {
  constructor(params) {
    this.params = params;
    this.time = 0;
    this.state = {};
    this.insights = [];
    this.isComplete = false;
  }

  update(dt) {
    this.time += dt;
    this.calculateState();
    this.checkInsights();
  }

  calculateState() {
    throw new Error('Must implement calculateState()');
  }

  render(ctx) {
    throw new Error('Must implement render()');
  }

  checkInsights() {
    // Override in subclasses
  }

  getInsights() {
    return this.insights;
  }

  getWhatIf() {
    return [];
  }

  reset() {
    this.time = 0;
    this.state = {};
    this.insights = [];
    this.isComplete = false;
  }
}
