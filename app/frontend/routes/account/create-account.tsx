import React from 'react';
import { Card } from 'app/frontend/reusable-components/card/card';
import { Input } from 'app/frontend/reusable-components/input/input';
import { Button } from 'app/frontend/reusable-components/button/button';

export function CreateNewAccount() {
  return (
    // TODO: Add SVG at the top of the card, and center it
    <Card title="Create New Account">
      <div className="space-y-2">
        <Input label="Username" />
        <Input label="Password" />
        <Button href="/create-account">Create Account</Button>
      </div>
    </Card>
  );
}
