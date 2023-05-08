export interface TumblrOffsetParams {
  identifier: string;
  type?: string;
  offset?: number;
  limit?: number;
  before?: number;
  tag?: string;
}

interface BlogDescription {
  name: string;
  title: string;
  description: string;
  url: string;
  uuid: string;
  updated: number;
}

interface Theme {
  header_full_width: number;
  header_full_height: number;
  header_focus_width: number;
  header_focus_height: number;
  avatar_shape: string;
  background_color: string;
  body_font: string;
  header_bounds: string;
  header_image: string;
  header_image_focused: string;
  header_image_poster: string;
  header_image_scaled: string;
  header_stretch: boolean;
  link_color: string;
  show_avatar: boolean;
  show_description: boolean;
  show_header_image: boolean;
  show_title: boolean;
  title_color: string;
  title_font: string;
  title_font_weight: string;
}

export interface TumblrBasePost {
  blog_name: string;
  blog: BlogDescription;
  id: string;
  id_string: string;
  post_url: string;
  slug: string;
  date: string;
  timestamp: number;
  state: string;
  format: "html";
  reblog_key: string;
  tags: string[];
  short_url: string;
  summary: string;
  note_count: number;
  trail: {
    blog: {
      name: string;
      active: boolean;
      theme: Theme;
      share_likes: boolean;
      share_following: boolean;
      can_be_followed: boolean;
    };
    post: {
      id: string;
    };
    content_raw: string;
    content: string;
    is_current_item: boolean;
    is_root_item: boolean;
  }[];
  reblog: {
    comment: string;
    tree_html: string;
  };
  should_open_in_legacy: boolean;
  recommended_source: null | string;
  recommended_color: null | string;

  can_like: boolean;
  interactability_reblog: string;
  can_reblog: boolean;
  can_send_in_message: boolean;
  can_reply: boolean;
  display_avatar: boolean;
}

export interface TumblrPhotoPost extends TumblrBasePost {
  type: "photo";
  caption: string;
  image_permalink: string;
  photos: {
    caption: string;
    original_size: {
      url: string;
      width: number;
      height: number;
    };
    alt_sizes: {
      url: string;
      width: number;
      height: number;
    }[];
  }[];
}

export interface TumblrTextPost extends TumblrBasePost {
  type: "text";
  title: string;
  body: string;
}

export type TumblrPost = TumblrPhotoPost | TumblrTextPost;
