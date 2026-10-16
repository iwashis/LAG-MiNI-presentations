---
theme: default
title: Groups and fields
transition: slide-left
class: cover
fonts:
  provider: none
---

<div class="kicker">Linear Algebra · Warsaw University of Technology</div>

# Groups and fields

<div class="subtitle">Lecture 2 · Tomasz Brengos</div>

---
class: section-slide
transition: fade
---

<div class="sec-num">01</div>

<div class="kicker">Section 01</div>

# Motivation

---

# An impossible-sounding problem

Every time your browser shows a padlock, this just happened:

<v-click>

Two computers that have *never met* agree on a secret key —
while every message between them travels through wires and routers
that anyone can read.

</v-click>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

Whisper a secret across a crowded room, in plain voice, so that everyone
hears every word — yet only the two of you learn the secret. That is the
requirement.

</div>

</v-click>

<v-click>

It is solved billions of times a day. The solution is not locks or
wires — it is *algebra*: arithmetic in a finite group.

</v-click>

<!--
The padlock hook. Emphasise: no shared secret beforehand, public channel only.
-->

---

# Diffie--Hellman, with real numbers (1976)

Everything in **bold** is public. Alice keeps $a = 6$ secret,
Bob keeps $b = 15$ secret.

<StepThrough :steps="['\**p = 23**,   \**g = 5**', 'A = g^a \\bmod p = 5^6 \\bmod 23 = \**8**', 'B = g^b \\bmod p = 5^{15} \\bmod 23 = \**19**', 'B^a \\equiv g^{ba} = g^{ab} \\equiv A^b \\equiv 2 \\pmod{23}']" :captions="['public agreement, everyone sees it', 'Alice sends her mix — the exponent stays hidden', 'Bob sends his mix', 'each raises the other\'s mix to their own secret']" />

<v-click>

Both arrive at the shared secret $2$. The eavesdropper holds $23, 5, 8, 19$ —
and recovering $a$ from $8 = 5^a \bmod 23$ is the *discrete logarithm
problem*: easy to state, and (for a 600-digit $p$) believed to be hopelessly
hard. The entire padlock rests on that asymmetry.

</v-click>

---

# The algebra your day already used

<v-clicks>

- **Key exchange and RSA** — arithmetic modulo a prime: the finite
  groups and fields of this lecture.
- **QR codes, Wi-Fi, scratched CDs** — Reed--Solomon error correction
  and the AES cipher compute in a field with $256$ elements.
- **Every single bit** — $\{0,1\}$ with XOR and AND is the smallest
  field of all. Hashing, checksums and cryptanalysis are linear algebra over it.

</v-clicks>

---

# Programming against an interface

An *interface* declares which operations a type must support and which
laws they must obey — and code written against the interface runs on
*every* implementation.

<v-click>

This lecture does exactly that to arithmetic:

- a *group* — one operation, three laws;
- a *field* — two operations, tied by distributivity.

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Every theorem proved from the axioms alone is proved *once* — for
$\R$, for $\C$, for residues modulo a prime, for invertible matrices.
And fields are precisely the *scalars* over which the whole course
is built: vector spaces, matrices, determinants, eigenvalues.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">02</div>

<div class="kicker">Section 02</div>

# Groups

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

A *group* is a set $G$ with a binary operation $*\colon G\times G\to G$
such that:

- $(a*b)*c = a*(b*c)$   (associativity)
- there is $e\in G$ with $a*e = e*a = a$ for all $a$   (identity)
- every $a\in G$ has $a^{-1}\in G$ with $a*a^{-1} = a^{-1}*a = e$   (inverses)

If moreover $a*b = b*a$ for all $a,b$, the group is *abelian*.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Additive notation: operation $+$, identity $0$, inverse $-a$.
Multiplicative notation: operation $\cdot$, identity $1$, inverse $a^{-1}$.

</div>

</v-click>

---

# Modular arithmetic

<div class="thm def">

<span class="lbl">Definition</span>

For a positive integer $n$, $\ a \bmod n$ is the remainder of dividing $a$
by $n$: the unique $r \in \{0, 1, \ldots, n-1\}$ with $a = qn + r$.
On $\Z_n = \{0, 1, \ldots, n-1\}$ we define

$$
a +_n b = (a+b) \bmod n, \qquad a \cdot_n b = (a \cdot b) \bmod n.
$$

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$17 \bmod 4 = 1$,   $4 \bmod 17 = 4$,   $(-2) \bmod 5 = 3$
(the remainder is always in $\{0,\ldots,n-1\}$).
In $\Z_6$:  $4 +_6 5 = 3$ and $4 \cdot_6 5 = 2$.

</div>

</v-click>

<v-click>

This is clock arithmetic — hour $9$ plus $5$ hours is hour $2$ — and it is
the arithmetic Diffie--Hellman ran on.

</v-click>

---

# A zoo of groups

<v-clicks>

- $(\Z, +)$, $(\Q, +)$, $(\R, +)$, $(\C, +)$ — abelian; identity $0$,
  inverse $-a$.
- $(\Q\setminus\{0\}, \cdot)$, $(\R\setminus\{0\}, \cdot)$,
  $(\C\setminus\{0\}, \cdot)$ — abelian; identity $1$, inverse $\tfrac1a$.
- $(\Z, \cdot)$ is *not* a group: apart from $\pm 1$, no integer has
  an integer reciprocal.
- $(\Z_n, +_n)$ — a finite abelian group: the inverse of $a$ is $n - a$.
- Invertible $2\times 2$ matrices under multiplication (Lecture 4) — a
  group that is *not* abelian.

</v-clicks>

---

# Finite multiplicative groups

For a prime $p$, the non-zero residues $\Z_p \setminus \{0\}$ form a group
under $\cdot_p$ — the group where Diffie--Hellman lives.

<v-click>

Inverses let us solve equations exactly as in $\R$. In $\Z_7$, solve
$2 \cdot_7 x = 5$:

<StepThrough :steps="['2 \\cdot_7 4 = 8 \\bmod 7 = 1,   \\text{so } 2^{-1} = 4', 'x = 4 \\cdot_7 5 = 20 \\bmod 7 = 6', '2 \\cdot_7 6 = 12 \\bmod 7 = 5 \\checkmark']" :captions="['find the inverse of 2', 'multiply both sides by it', 'check']" />

</v-click>

---

# Roots of unity revisited

<div class="cols">

<div>

The $n$-th roots of unity from Lecture 1,

$$
U_n = \left\{ \cos\tfrac{2k\pi}{n} + i \sin\tfrac{2k\pi}{n} \right\},
$$

form an abelian group under multiplication: arguments add, so the product of
two roots is again a root.

Identity: $1$. Inverse: the conjugate.

Multiplying the roots adds the exponents $k$ modulo $n$ — the group $U_n$
*is* $(\Z_n, +_n)$ wearing a geometric costume.

</div>

<div>

<div class="widget"><RootsOfUnity :n="6" /></div>

</div>

</div>

---

# First theorems from the axioms alone

<div class="thm rem">

<span class="lbl">Fact</span>

In any group the identity is unique, and each element has exactly one inverse.

</div>

<StepThrough :steps="['e = e * e\' = e\'', 'b = b * e = b * (a * b\')', '= (b * a) * b\' = e * b\' = b\'']" :captions="['two identities e and e — prime', 'two inverses b and b — prime — of a', 'associativity finishes it']" />

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

Cancellation: $a * b = a * c$ implies $b = c$ (multiply by $a^{-1}$ on the
left). These proofs used nothing but the three axioms — so they hold in
*every* group in the zoo, matrices included.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">03</div>

<div class="kicker">Section 03</div>

# Fields

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

A *field* is a set $\K$ with two operations $+$ and $\cdot$ such that:

- $(\K, +)$ is an abelian group with identity $0$;
- $(\K \setminus \{0\}, \cdot)$ is an abelian group with identity $1$;
- multiplication distributes over addition: $(a+b)\cdot c = a\cdot c + b\cdot c$.

</div>

<v-click>

Subtraction and division come for free: $a - b = a + (-b)$ and
$\tfrac{a}{b} = a \cdot \tfrac1b$ for $b \neq 0$. All four operations,
with all the usual rules.

</v-click>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\Q$, $\R$ and $\C$ are fields. $\Z$ is *not*: $2$ has no integer
reciprocal.

</div>

</v-click>

---

# First consequences

<div class="thm rem">

<span class="lbl">Fact</span>

In any field: $a \cdot 0 = 0$,   $(-1)\cdot a = -a$,   and there are
*no zero divisors*:

$$
a \cdot b = 0 \implies a = 0 \ \text{ or } \ b = 0.
$$

</div>

<v-click>

<StepThrough :steps="['b = 1 \\cdot b = \\left( \\tfrac1a \\cdot a \\right) \\cdot b', '= \\tfrac1a \\cdot (a \\cdot b) = \\tfrac1a \\cdot 0 = 0']" :captions="['suppose ab = 0 and a is nonzero', 'associativity, then the first fact']" />

</v-click>

<v-click>

No zero divisors is exactly what makes cancellation — and solving
equations — possible.

</v-click>

---

# The multiplication table decides everything

<div class="cols">

<div>

Is $\Z_n$ a field? The table answers.

An element $a$ is *invertible* exactly when a $1$ appears in its row —
highlighted below.

**Try it:** set $n = 5$, then $n = 4$. Watch the row of $2$: modulo $4$
it reads $0, 2, 0, 2$ — no $1$, ever. And $2 \cdot_4 2 = 0$: a zero divisor.

Switch to $+$: *every* $\Z_n$ is a group under addition.

</div>

<div>

<div class="widget"><ModTable :n="5" op="mul" /></div>

</div>

</div>

---

# When is it a field?

<div class="thm theo">

<span class="lbl">Theorem</span>

$\Z_n$ is a field  if and only if  $n$ is a prime number.

</div>

<v-click>

<StepThrough :steps="['n = a \\cdot b,   1 < a, b < n \\implies a \\cdot_n b = 0', 'a \\cdot_p x = a \\cdot_p y \\implies p \\mid a(x - y) \\implies x = y', '\\{ a \\cdot_p 1, \…, a \\cdot_p (p-1) \\} = \\{1, \…, p-1\\} \\ni 1']" :captions="['composite n gives zero divisors', 'prime p: the row of a has no zeros and no repeats', 'n minus 1 distinct non-zero products must fill the row']" />

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

The proof shows an inverse *exists* without finding it. In practice
inverses modulo $p$ are computed by the extended Euclidean algorithm — a
staple of every crypto library.

</div>

</v-click>

---

# The smallest field: a single bit

<div class="thm ex">

<span class="lbl">Example</span>

$\Z_2 = \{0, 1\}$ with the tables

$$
\begin{array}{c|cc} + & 0 & 1 \\ \hline 0 & 0 & 1 \\ 1 & 1 & 0 \end{array}
\qquad\qquad
\begin{array}{c|cc} \cdot & 0 & 1 \\ \hline 0 & 0 & 0 \\ 1 & 0 & 1 \end{array}
$$

is a field — the smallest one.

</div>

<v-click>

Read the tables again: addition is the **XOR** gate, multiplication is
the **AND** gate. A bit is not a metaphor for a field element —
it *is* one.

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Linear algebra over $\Z_2$ powers checksums, hashing, error-correcting codes
and cryptanalysis. AES and QR codes use its big sibling: a field with
$2^8 = 256$ elements, one per byte.

</div>

</v-click>

---

# A field between the rationals and the reals

<div class="thm ex">

<span class="lbl">Example</span>

$\Q(\sqrt2) = \{ a + b\sqrt2 \mid a, b \in \Q \}$ is a field.

</div>

The only doubtful axiom is the reciprocal — and the trick is the one that
worked for complex numbers:

<StepThrough :steps="['\\frac{1}{a + b\\sqrt2} = \\frac{a - b\\sqrt2}{(a + b\\sqrt2)(a - b\\sqrt2)}', '= \\frac{a}{a^2 - 2b^2} - \\frac{b}{a^2 - 2b^2}\\,\\sqrt2', 'a^2 - 2b^2 \\neq 0 \ \\text{ for } (a,b) \\neq (0,0)']" :captions="['multiply by the conjugate', 'the denominator is rational', 'and nonzero, because sqrt 2 is irrational']" />

---

# Summary

<v-clicks>

- A **group**: one operation, three laws — associativity, identity,
  inverses. Proofs from the axioms hold for every implementation at once.
- **Modular arithmetic**: $\Z_n$ is always an additive group;
  its non-zero part is a multiplicative group exactly for prime $n$.
- A **field**: two intertwined abelian groups — $\Q$, $\R$, $\C$,
  $\Z_p$, $\Q(\sqrt2)$, and the single bit $\Z_2$.
- Cryptography, error correction and your Wi-Fi all compute in finite
  groups and fields — this is applied mathematics at planetary scale.
- **Next lecture:** vector spaces — where fields become the
  *scalars* and linear algebra properly begins.

</v-clicks>
