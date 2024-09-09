import React from 'react';
import { Button } from '../../../reusable-components/button/button.tsx';
import { Card } from '../../../reusable-components/card/card.tsx';
import { FlowLayout } from '../../../reusable-components/flow-layout/flow-layout.tsx';
import { Input } from '../../../reusable-components/input/input.tsx';

export function JointAccess() {
  return (
    <FlowLayout>
      <Card
        title="Will this be a joint account?"
        description="Joint accounts allow for a secondary account holder which provides the same level of access as the primary."
      >
        <div className="space-y-2">
          <Input label="First name" />
          <Input label="Last name" />
          <Input label="Email" />
          <Button href="/signup/stock-restrictions">Continue</Button>
        </div>
      </Card>
    </FlowLayout>
  );
}
