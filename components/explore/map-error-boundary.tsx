"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class MapErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Interactive map unavailable", error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="map-unavailable" role="status">
          <p className="section-kicker">Map unavailable</p>
          <h2>The place index is still ready.</h2>
          <p>
            Use the searchable list to open every place while the interactive map is
            unavailable.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Try the map again
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
