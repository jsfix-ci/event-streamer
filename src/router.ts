import { Server } from './server';
import { InputEvent, InputEventCtor, RawEvent } from './events';
import { Action, ActionCtor } from './action';

export class Router {
  private server: Server;
  private routes = new Map<string, Route>();

  setEmitter(server: Server) {
    this.server = server;
  }

  add(event: InputEventCtor, action: ActionCtor): void {
    const route = this.routes.get(event.code) || new Route(event);
    route.add(action);
    this.routes.set(event.code, route);
  }

  route(rawEvent: RawEvent): Promise<any> {
    const route = this.routes.get(rawEvent.code);
    if (!route) {
      return Promise.resolve();
    }
    return route.handle(rawEvent, this.server);
  }
}

export class Route {
  private actions: ActionCtor[] = [];

  constructor(private event: InputEventCtor) { }

  add(action: ActionCtor) {
    this.actions.push(action);
  }

  handle(rawEvent: RawEvent, server: Server): Promise<any> {
    const event = new this.event(rawEvent);
    return Promise.all(this.performances(event, server));
  }

  private performances(event: InputEvent, server: Server): Promise<any>[] {
    return this.actions
      .map(actionCtor => new actionCtor(server))
      .map(action => action.perform(event));
  }
}
