import { DocNodeKind, IDocNodeParameters, DocNode } from './DocNode';
import { StringChecks } from '../parser/StringChecks';
import { DocParticle } from './DocParticle';
import { Excerpt } from '../parser/Excerpt';

/**
 * Constructor parameters for {@link DocInlineTag}.
 */
export interface IDocInlineTagParameters extends IDocNodeParameters {
  openingDelimiterExcerpt?: Excerpt;

  tagNameExcerpt?: Excerpt;
  tagName: string;

  tagContentExcerpt?: Excerpt;
  tagContent: string;

  closingDelimiterExcerpt?: Excerpt;
}

/**
 * Represents a TSDoc inline tag such as `{@inheritDoc}` or `{@link}`.
 */
export class DocInlineTag extends DocNode {
  /** {@inheritDoc} */
  public readonly kind: DocNodeKind = DocNodeKind.InlineTag;

  private _openingDelimiterParticle: DocParticle | undefined;  // never undefined after updateParameters()
  private _tagNameParticle: DocParticle | undefined;           // never undefined after updateParameters()
  private _tagContentParticle: DocParticle | undefined;        // never undefined after updateParameters()
  private _closingDelimiterParticle: DocParticle | undefined;  // never undefined after updateParameters()

  /**
   * Don't call this directly.  Instead use {@link TSDocParser}
   * @internal
   */
  public constructor(parameters: IDocInlineTagParameters) {
    super(parameters);
  }

  /**
   * The TSDoc tag name.
   * For example, if the inline tag is `{@link Guid.toString | the toString() method}`
   * then the tag name would be `@link`.
   */
  public get tagName(): string {
    return this._tagNameParticle!.content;
  }

  /**
   * The tag content.
   * For example, if the inline tag is `{@link Guid.toString | the toString() method}`
   * then the tag content would be `Guid.toString | the toString() method`.
   */
  public get tagContent(): string {
    return this._tagContentParticle!.content;
  }

  /** @override */
  public updateParameters(parameters: IDocInlineTagParameters): void {
    StringChecks.validateTSDocTagName(parameters.tagName);

    super.updateParameters(parameters);

    this._openingDelimiterParticle = new DocParticle({
      particleId: 'openingDelimiter',
      excerpt: parameters.openingDelimiterExcerpt,
      content: '{'
    });

    this._tagNameParticle = new DocParticle({
      particleId: 'tagName',
      excerpt: parameters.tagNameExcerpt,
      content: parameters.tagName
    });

    this._tagContentParticle = new DocParticle({
      particleId: 'tagContent',
      excerpt: parameters.tagContentExcerpt,
      content: parameters.tagContent
    });

    this._closingDelimiterParticle = new DocParticle({
      particleId: 'closingDelimiter',
      excerpt: parameters.closingDelimiterExcerpt,
      content: '}'
    });
  }

  /**
   * {@inheritDoc}
   * @override @sealed
   */
  public getChildNodes(): ReadonlyArray<DocNode> {
    return [
      this._openingDelimiterParticle!,
      this._tagNameParticle!,
      ...this.getChildNodesForContent(),
      this._closingDelimiterParticle!
    ];
  }

  /**
   * Allows child classes to replace the tagContentParticle with a more detailed
   * set of nodes.
   * @virtual
   */
  protected getChildNodesForContent(): ReadonlyArray<DocNode> {
    return [
      this._tagContentParticle!
    ];
  }

  protected get tagContentParticle(): DocParticle {
    return this._tagContentParticle!;
  }
}
