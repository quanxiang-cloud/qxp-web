type DeptInfo = {
  departmentName: string;
  id: string;
  pid?: string;
};

type DeptTree = {
  child: Array<DeptTree>;
  departmentName: string;
  grade: number;
  id: string;
  superID: string;
  useStatus: number;
};

interface Document
  extends Node,
    DocumentAndElementEventHandlers,
    DocumentOrShadowRoot,
    GlobalEventHandlers,
    NonElementParentNode,
    ParentNode,
    XPathEvaluatorBase {
  attachEvent: any;
  /**
   * Sets or gets the URL for the current document.
   */
  readonly URL: string;
  /**
   * Sets or gets the color of all active links in the document.
   */
  /** @deprecated */
  alinkColor: string;
  /**
   * Returns a reference to the collection of elements contained by the object.
   */
  /** @deprecated */
  readonly all: HTMLAllCollection;
  /**
   * Retrieves a collection of all a objects that have a name and/or id property. Objects in this collection are in HTML source order.
   */
  /** @deprecated */
  readonly anchors: HTMLCollectionOf<HTMLAnchorElement>;
  /**
   * Retrieves a collection of all applet objects in the document.
   */
  /** @deprecated */
  readonly applets: HTMLCollectionOf<HTMLAppletElement>;
  /**
   * Deprecated. Sets or retrieves a value that indicates the background color behind the object.
   */
  /** @deprecated */
  bgColor: string;
  /**
   * Specifies the beginning and end of the document body.
   */
  body: HTMLElement;
  /**
   * Returns document's encoding.
   */
  readonly characterSet: string;
  /**
   * Gets or sets the character set used to encode the object.
   */
  readonly charset: string;
  /**
   * Gets a value that indicates whether standards-compliant mode is switched on for the object.
   */
  readonly compatMode: string;
  /**
   * Returns document's content type.
   */
  readonly contentType: string;
  /**
   * Returns the HTTP cookies that apply to the Document. If there are no cookies or cookies can't be applied to this resource, the empty string will be returned.
   *
   * Can be set, to add a new cookie to the element's set of HTTP cookies.
   *
   * If the contents are sandboxed into a unique origin (e.g. in an iframe with the sandbox attribute), a "SecurityError" DOMException will be thrown on getting and setting.
   */
  cookie: string;
  /**
   * Returns the script element, or the SVG script element, that is currently executing, as long as the element represents a classic script. In the case of reentrant script execution, returns the one that most recently started executing amongst those that have not yet finished executing.
   *
   * Returns null if the Document is not currently executing a script or SVG script element (e.g., because the running script is an event handler, or a timeout), or if the currently executing script or SVG script element represents a module script.
   */
  readonly currentScript: HTMLOrSVGScriptElement | null;
  readonly defaultView: (WindowProxy & typeof globalThis) | null;
  /**
   * Sets or gets a value that indicates whether the document can be edited.
   */
  designMode: string;
  /**
   * Sets or retrieves a value that indicates the reading order of the object.
   */
  dir: string;
  /**
   * Gets an object representing the document type declaration associated with the current document.
   */
  readonly doctype: DocumentType | null;
  /**
   * Gets a reference to the root node of the document.
   */
  readonly documentElement: HTMLElement;
  /**
   * Returns document's URL.
   */
  readonly documentURI: string;
  /**
   * Sets or gets the security domain of the document.
   */
  domain: string;
  /**
   * Retrieves a collection of all embed objects in the document.
   */
  readonly embeds: HTMLCollectionOf<HTMLEmbedElement>;
  /**
   * Sets or gets the foreground (text) color of the document.
   */
  /** @deprecated */
  fgColor: string;
  /**
   * Retrieves a collection, in source order, of all form objects in the document.
   */
  readonly forms: HTMLCollectionOf<HTMLFormElement>;
  /** @deprecated */
  readonly fullscreen: boolean;
  /**
   * Returns true if document has the ability to display elements fullscreen and fullscreen is supported, or false otherwise.
   */
  readonly fullscreenEnabled: boolean;
  /**
   * Returns the head element.
   */
  readonly head: HTMLHeadElement;
  readonly hidden: boolean;
  /**
   * Retrieves a collection, in source order, of img objects in the document.
   */
  readonly images: HTMLCollectionOf<HTMLImageElement>;
  /**
   * Gets the implementation object of the current document.
   */
  readonly implementation: DOMImplementation;
  /**
   * Returns the character encoding used to create the webpage that is loaded into the document object.
   */
  readonly inputEncoding: string;
  /**
   * Gets the date that the page was last modified, if the page supplies one.
   */
  readonly lastModified: string;
  /**
   * Sets or gets the color of the document links.
   */
  /** @deprecated */
  linkColor: string;
  /**
   * Retrieves a collection of all a objects that specify the href property and all area objects in the document.
   */
  readonly links: HTMLCollectionOf<HTMLAnchorElement | HTMLAreaElement>;
  /**
   * Contains information about the current URL.
   */
  location: Location;
  onfullscreenchange: ((this: Document, ev: Event) => any) | null;
  onfullscreenerror: ((this: Document, ev: Event) => any) | null;
  onpointerlockchange: ((this: Document, ev: Event) => any) | null;
  onpointerlockerror: ((this: Document, ev: Event) => any) | null;
  /**
   * Fires when the state of the object has changed.
   * @param ev The event
   */
  onreadystatechange: ((this: Document, ev: Event) => any) | null;
  onvisibilitychange: ((this: Document, ev: Event) => any) | null;
  readonly ownerDocument: null;
  /**
   * Return an HTMLCollection of the embed elements in the Document.
   */
  readonly plugins: HTMLCollectionOf<HTMLEmbedElement>;
  /**
   * Retrieves a value that indicates the current state of the object.
   */
  readonly readyState: DocumentReadyState;
  /**
   * Gets the URL of the location that referred the user to the current page.
   */
  readonly referrer: string;
  /**
   * Retrieves a collection of all script objects in the document.
   */
  readonly scripts: HTMLCollectionOf<HTMLScriptElement>;
  readonly scrollingElement: Element | null;
  readonly timeline: DocumentTimeline;
  /**
   * Contains the title of the document.
   */
  title: string;
  readonly visibilityState: VisibilityState;
  /**
   * Sets or gets the color of the links that the user has visited.
   */
  /** @deprecated */
  vlinkColor: string;
  /**
   * Moves node from another document and returns it.
   *
   * If node is a document, throws a "NotSupportedError" DOMException or, if node is a shadow root, throws a "HierarchyRequestError" DOMException.
   */
  adoptNode<T extends Node>(source: T): T;
  /** @deprecated */
  captureEvents(): void;
  caretPositionFromPoint(x: number, y: number): CaretPosition | null;
  /** @deprecated */
  caretRangeFromPoint(x: number, y: number): Range;
  /** @deprecated */
  clear(): void;
  /**
   * Closes an output stream and forces the sent data to display.
   */
  close(): void;
  /**
   * Creates an attribute object with a specified name.
   * @param name String that sets the attribute object's name.
   */
  createAttribute(localName: string): Attr;
  createAttributeNS(namespace: string | null, qualifiedName: string): Attr;
  /**
   * Returns a CDATASection node whose data is data.
   */
  createCDATASection(data: string): CDATASection;
  /**
   * Creates a comment object with the specified data.
   * @param data Sets the comment object's data.
   */
  createComment(data: string): Comment;
  /**
   * Creates a new document.
   */
  createDocumentFragment(): DocumentFragment;
  /**
   * Creates an instance of the element for the specified tag.
   * @param tagName The name of an element.
   */
  createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementTagNameMap[K];
  /** @deprecated */
  createElement<K extends keyof HTMLElementDeprecatedTagNameMap>(
    tagName: K,
    options?: ElementCreationOptions
  ): HTMLElementDeprecatedTagNameMap[K];
  createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
  /**
   * Returns an element with namespace namespace. Its namespace prefix will be everything before ":" (U+003E) in qualifiedName or null. Its local name will be everything after ":" (U+003E) in qualifiedName or qualifiedName.
   *
   * If localName does not match the Name production an "InvalidCharacterError" DOMException will be thrown.
   *
   * If one of the following conditions is true a "NamespaceError" DOMException will be thrown:
   *
   * localName does not match the QName production.
   * Namespace prefix is not null and namespace is the empty string.
   * Namespace prefix is "xml" and namespace is not the XML namespace.
   * qualifiedName or namespace prefix is "xmlns" and namespace is not the XMLNS namespace.
   * namespace is the XMLNS namespace and neither qualifiedName nor namespace prefix is "xmlns".
   *
   * When supplied, options's is can be used to create a customized built-in element.
   */
  createElementNS(
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    qualifiedName: string
  ): HTMLElement;
  createElementNS<K extends keyof SVGElementTagNameMap>(
    namespaceURI: 'http://www.w3.org/2000/svg',
    qualifiedName: K
  ): SVGElementTagNameMap[K];
  createElementNS(
    namespaceURI: 'http://www.w3.org/2000/svg',
    qualifiedName: string
  ): SVGElement;
  createElementNS(
    namespaceURI: string | null,
    qualifiedName: string,
    options?: ElementCreationOptions
  ): Element;
  createElementNS(
    namespace: string | null,
    qualifiedName: string,
    options?: string | ElementCreationOptions
  ): Element;
  createEvent(eventInterface: 'AnimationEvent'): AnimationEvent;
  createEvent(eventInterface: 'AnimationPlaybackEvent'): AnimationPlaybackEvent;
  createEvent(eventInterface: 'AudioProcessingEvent'): AudioProcessingEvent;
  createEvent(eventInterface: 'BeforeUnloadEvent'): BeforeUnloadEvent;
  createEvent(eventInterface: 'ClipboardEvent'): ClipboardEvent;
  createEvent(eventInterface: 'CloseEvent'): CloseEvent;
  createEvent(eventInterface: 'CompositionEvent'): CompositionEvent;
  createEvent(eventInterface: 'CustomEvent'): CustomEvent;
  createEvent(eventInterface: 'DeviceLightEvent'): DeviceLightEvent;
  createEvent(eventInterface: 'DeviceMotionEvent'): DeviceMotionEvent;
  createEvent(eventInterface: 'DeviceOrientationEvent'): DeviceOrientationEvent;
  createEvent(eventInterface: 'DragEvent'): DragEvent;
  createEvent(eventInterface: 'ErrorEvent'): ErrorEvent;
  createEvent(eventInterface: 'Event'): Event;
  createEvent(eventInterface: 'Events'): Event;
  createEvent(eventInterface: 'FocusEvent'): FocusEvent;
  createEvent(eventInterface: 'FocusNavigationEvent'): FocusNavigationEvent;
  createEvent(eventInterface: 'GamepadEvent'): GamepadEvent;
  createEvent(eventInterface: 'HashChangeEvent'): HashChangeEvent;
  createEvent(eventInterface: 'IDBVersionChangeEvent'): IDBVersionChangeEvent;
  createEvent(eventInterface: 'InputEvent'): InputEvent;
  createEvent(eventInterface: 'KeyboardEvent'): KeyboardEvent;
  createEvent(
    eventInterface: 'ListeningStateChangedEvent'
  ): ListeningStateChangedEvent;
  createEvent(eventInterface: 'MSGestureEvent'): MSGestureEvent;
  createEvent(eventInterface: 'MSMediaKeyMessageEvent'): MSMediaKeyMessageEvent;
  createEvent(eventInterface: 'MSMediaKeyNeededEvent'): MSMediaKeyNeededEvent;
  createEvent(eventInterface: 'MSPointerEvent'): MSPointerEvent;
  createEvent(eventInterface: 'MediaEncryptedEvent'): MediaEncryptedEvent;
  createEvent(eventInterface: 'MediaKeyMessageEvent'): MediaKeyMessageEvent;
  createEvent(eventInterface: 'MediaQueryListEvent'): MediaQueryListEvent;
  createEvent(eventInterface: 'MediaStreamErrorEvent'): MediaStreamErrorEvent;
  createEvent(eventInterface: 'MediaStreamEvent'): MediaStreamEvent;
  createEvent(eventInterface: 'MediaStreamTrackEvent'): MediaStreamTrackEvent;
  createEvent(eventInterface: 'MessageEvent'): MessageEvent;
  createEvent(eventInterface: 'MouseEvent'): MouseEvent;
  createEvent(eventInterface: 'MouseEvents'): MouseEvent;
  createEvent(eventInterface: 'MutationEvent'): MutationEvent;
  createEvent(eventInterface: 'MutationEvents'): MutationEvent;
  createEvent(
    eventInterface: 'OfflineAudioCompletionEvent'
  ): OfflineAudioCompletionEvent;
  createEvent(eventInterface: 'OverflowEvent'): OverflowEvent;
  createEvent(eventInterface: 'PageTransitionEvent'): PageTransitionEvent;
  createEvent(
    eventInterface: 'PaymentRequestUpdateEvent'
  ): PaymentRequestUpdateEvent;
  createEvent(
    eventInterface: 'PermissionRequestedEvent'
  ): PermissionRequestedEvent;
  createEvent(eventInterface: 'PointerEvent'): PointerEvent;
  createEvent(eventInterface: 'PopStateEvent'): PopStateEvent;
  createEvent(eventInterface: 'ProgressEvent'): ProgressEvent;
  createEvent(eventInterface: 'PromiseRejectionEvent'): PromiseRejectionEvent;
  createEvent(eventInterface: 'RTCDTMFToneChangeEvent'): RTCDTMFToneChangeEvent;
  createEvent(eventInterface: 'RTCDataChannelEvent'): RTCDataChannelEvent;
  createEvent(
    eventInterface: 'RTCDtlsTransportStateChangedEvent'
  ): RTCDtlsTransportStateChangedEvent;
  createEvent(eventInterface: 'RTCErrorEvent'): RTCErrorEvent;
  createEvent(
    eventInterface: 'RTCIceCandidatePairChangedEvent'
  ): RTCIceCandidatePairChangedEvent;
  createEvent(eventInterface: 'RTCIceGathererEvent'): RTCIceGathererEvent;
  createEvent(
    eventInterface: 'RTCIceTransportStateChangedEvent'
  ): RTCIceTransportStateChangedEvent;
  createEvent(
    eventInterface: 'RTCPeerConnectionIceErrorEvent'
  ): RTCPeerConnectionIceErrorEvent;
  createEvent(
    eventInterface: 'RTCPeerConnectionIceEvent'
  ): RTCPeerConnectionIceEvent;
  createEvent(eventInterface: 'RTCSsrcConflictEvent'): RTCSsrcConflictEvent;
  createEvent(eventInterface: 'RTCStatsEvent'): RTCStatsEvent;
  createEvent(eventInterface: 'RTCTrackEvent'): RTCTrackEvent;
  createEvent(eventInterface: 'SVGZoomEvent'): SVGZoomEvent;
  createEvent(eventInterface: 'SVGZoomEvents'): SVGZoomEvent;
  createEvent(
    eventInterface: 'SecurityPolicyViolationEvent'
  ): SecurityPolicyViolationEvent;
  createEvent(
    eventInterface: 'ServiceWorkerMessageEvent'
  ): ServiceWorkerMessageEvent;
  createEvent(
    eventInterface: 'SpeechRecognitionErrorEvent'
  ): SpeechRecognitionErrorEvent;
  createEvent(eventInterface: 'SpeechRecognitionEvent'): SpeechRecognitionEvent;
  createEvent(
    eventInterface: 'SpeechSynthesisErrorEvent'
  ): SpeechSynthesisErrorEvent;
  createEvent(eventInterface: 'SpeechSynthesisEvent'): SpeechSynthesisEvent;
  createEvent(eventInterface: 'StorageEvent'): StorageEvent;
  createEvent(eventInterface: 'TextEvent'): TextEvent;
  createEvent(eventInterface: 'TouchEvent'): TouchEvent;
  createEvent(eventInterface: 'TrackEvent'): TrackEvent;
  createEvent(eventInterface: 'TransitionEvent'): TransitionEvent;
  createEvent(eventInterface: 'UIEvent'): UIEvent;
  createEvent(eventInterface: 'UIEvents'): UIEvent;
  createEvent(eventInterface: 'VRDisplayEvent'): VRDisplayEvent;
  createEvent(eventInterface: 'VRDisplayEvent '): VRDisplayEvent;
  createEvent(eventInterface: 'WebGLContextEvent'): WebGLContextEvent;
  createEvent(eventInterface: 'WheelEvent'): WheelEvent;
  createEvent(eventInterface: string): Event;
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   * @param root The root element or node to start traversing on.
   * @param whatToShow The type of nodes or elements to appear in the node list
   * @param filter A custom NodeFilter function to use. For more information, see filter. Use null for no filter.
   * @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
   */
  createNodeIterator(
    root: Node,
    whatToShow?: number,
    filter?: NodeFilter | null
  ): NodeIterator;
  /**
   * Returns a ProcessingInstruction node whose target is target and data is data. If target does not match the Name production an "InvalidCharacterError" DOMException will be thrown. If data contains "?>" an "InvalidCharacterError" DOMException will be thrown.
   */
  createProcessingInstruction(
    target: string,
    data: string
  ): ProcessingInstruction;
  /**
   *  Returns an empty range object that has both of its boundary points positioned at the beginning of the document.
   */
  createRange(): Range;
  /**
   * Creates a text string from the specified value.
   * @param data String that specifies the nodeValue property of the text node.
   */
  createTextNode(data: string): Text;
  /**
   * Creates a TreeWalker object that you can use to traverse filtered lists of nodes or elements in a document.
   * @param root The root element or node to start traversing on.
   * @param whatToShow The type of nodes or elements to appear in the node list. For more information, see whatToShow.
   * @param filter A custom NodeFilter function to use.
   * @param entityReferenceExpansion A flag that specifies whether entity reference nodes are expanded.
   */
  createTreeWalker(
    root: Node,
    whatToShow?: number,
    filter?: NodeFilter | null
  ): TreeWalker;
  /** @deprecated */
  createTreeWalker(
    root: Node,
    whatToShow: number,
    filter: NodeFilter | null,
    entityReferenceExpansion?: boolean
  ): TreeWalker;
  /**
   * Returns the element for the specified x coordinate and the specified y coordinate.
   * @param x The x-offset
   * @param y The y-offset
   */
  elementFromPoint(x: number, y: number): Element | null;
  elementsFromPoint(x: number, y: number): Element[];
  /**
   * Executes a command on the current document, current selection, or the given range.
   * @param commandId String that specifies the command to execute. This command can be any of the command identifiers that can be executed in script.
   * @param showUI Display the user interface, defaults to false.
   * @param value Value to assign.
   */
  execCommand(commandId: string, showUI?: boolean, value?: string): boolean;
  /**
   * Stops document's fullscreen element from being displayed fullscreen and resolves promise when done.
   */
  exitFullscreen(): Promise<void>;
  exitPointerLock(): void;
  getAnimations(): Animation[];
  /**
   * Returns a reference to the first object with the specified value of the ID attribute.
   * @param elementId String that specifies the ID value.
   */
  getElementById(elementId: string): HTMLElement | null;
  /**
   * Returns a HTMLCollection of the elements in the object on which the method was invoked (a document or an element) that have all the classes given by classNames. The classNames argument is interpreted as a space-separated list of classes.
   */
  getElementsByClassName(classNames: string): HTMLCollectionOf<Element>;
  /**
   * Gets a collection of objects based on the value of the NAME or ID attribute.
   * @param elementName Gets a collection of objects based on the value of the NAME or ID attribute.
   */
  getElementsByName(elementName: string): NodeListOf<HTMLElement>;
  /**
   * Retrieves a collection of objects based on the specified element name.
   * @param name Specifies the name of an element.
   */
  getElementsByTagName<K extends keyof HTMLElementTagNameMap>(
    qualifiedName: K
  ): HTMLCollectionOf<HTMLElementTagNameMap[K]>;
  getElementsByTagName<K extends keyof SVGElementTagNameMap>(
    qualifiedName: K
  ): HTMLCollectionOf<SVGElementTagNameMap[K]>;
  getElementsByTagName(qualifiedName: string): HTMLCollectionOf<Element>;
  /**
   * If namespace and localName are "*" returns a HTMLCollection of all descendant elements.
   *
   * If only namespace is "*" returns a HTMLCollection of all descendant elements whose local name is localName.
   *
   * If only localName is "*" returns a HTMLCollection of all descendant elements whose namespace is namespace.
   *
   * Otherwise, returns a HTMLCollection of all descendant elements whose namespace is namespace and local name is localName.
   */
  getElementsByTagNameNS(
    namespaceURI: 'http://www.w3.org/1999/xhtml',
    localName: string
  ): HTMLCollectionOf<HTMLElement>;
  getElementsByTagNameNS(
    namespaceURI: 'http://www.w3.org/2000/svg',
    localName: string
  ): HTMLCollectionOf<SVGElement>;
  getElementsByTagNameNS(
    namespaceURI: string,
    localName: string
  ): HTMLCollectionOf<Element>;
  /**
   * Returns an object representing the current selection of the document that is loaded into the object displaying a webpage.
   */
  getSelection(): Selection | null;
  /**
   * Gets a value indicating whether the object currently has focus.
   */
  hasFocus(): boolean;
  /**
   * Returns a copy of node. If deep is true, the copy also includes the node's descendants.
   *
   * If node is a document or a shadow root, throws a "NotSupportedError" DOMException.
   */
  importNode<T extends Node>(importedNode: T, deep: boolean): T;
  /**
   * Opens a new window and loads a document specified by a given URL. Also, opens a new window that uses the url parameter and the name parameter to collect the output of the write method and the writeln method.
   * @param url Specifies a MIME type for the document.
   * @param name Specifies the name of the window. This name is used as the value for the TARGET attribute on a form or an anchor element.
   * @param features Contains a list of items separated by commas. Each item consists of an option and a value, separated by an equals sign (for example, "fullscreen=yes, toolbar=yes"). The following values are supported.
   * @param replace Specifies whether the existing entry for the document is replaced in the history list.
   */
  open(
    url?: string,
    name?: string,
    features?: string,
    replace?: boolean
  ): Document;
  /**
   * Returns a Boolean value that indicates whether a specified command can be successfully executed using execCommand, given the current state of the document.
   * @param commandId Specifies a command identifier.
   */
  queryCommandEnabled(commandId: string): boolean;
  /**
   * Returns a Boolean value that indicates whether the specified command is in the indeterminate state.
   * @param commandId String that specifies a command identifier.
   */
  queryCommandIndeterm(commandId: string): boolean;
  /**
   * Returns a Boolean value that indicates the current state of the command.
   * @param commandId String that specifies a command identifier.
   */
  queryCommandState(commandId: string): boolean;
  /**
   * Returns a Boolean value that indicates whether the current command is supported on the current range.
   * @param commandId Specifies a command identifier.
   */
  queryCommandSupported(commandId: string): boolean;
  /**
   * Returns the current value of the document, range, or current selection for the given command.
   * @param commandId String that specifies a command identifier.
   */
  queryCommandValue(commandId: string): string;
  /** @deprecated */
  releaseEvents(): void;
  /**
   * Writes one or more HTML expressions to a document in the specified window.
   * @param content Specifies the text and HTML tags to write.
   */
  write(...text: string[]): void;
  /**
   * Writes one or more HTML expressions, followed by a carriage return, to a document in the specified window.
   * @param content The text and HTML tags to write.
   */
  writeln(...text: string[]): void;
  addEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}
