import React from 'react';
import { Card } from 'app/frontend/reusable-components/card/card';
import { Input } from 'app/frontend/reusable-components/input/input';
import { Button } from 'app/frontend/reusable-components/button/button';
import { FlowLayout } from 'app/frontend/reusable-components/flow-layout/flow-layout';

export function CreateNewAccount() {
  return (
    <FlowLayout>
      <Card title="Create New Account" showWealthFrontLogo={true}>
        <div className="space-y-2">
          <Input label="Username" />
          <Input label="Password" />
          <Button href="/create-account" customClassNames="w-full text-center rounded-xl">
            Create Account
          </Button>
        </div>
      </Card>
    </FlowLayout>
  );
}
