export type PostLikeSummary = {
  likeCount: number;
  viewerHasLiked: boolean;
};

export type TogglePostLikeResult = {
  liked: boolean;
  likeCount: number;
};
