import React from 'react';
import { QuestionCardGroup } from './QuestionCardGroup';
import { QuestionCardSingle, QuestionCardProps } from './QuestionCardSingle';

export type { QuestionCardProps };

export const QuestionCard: React.FC<QuestionCardProps> = (props) => {
  if (props.question.type === 'cluster') {
    return <QuestionCardGroup {...props} />;
  }
  return <QuestionCardSingle {...props} />;
};

QuestionCard.displayName = "QuestionCard";
