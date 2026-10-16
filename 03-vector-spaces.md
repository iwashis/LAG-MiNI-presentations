---
theme: default
title: Vector spaces
transition: slide-left
class: cover
fonts:
  provider: none
---

<div class="kicker">Linear Algebra · Warsaw University of Technology</div>

# Vector spaces

<div class="subtitle">Lecture 3 · Tomasz Brengos</div>

---
class: section-slide
transition: fade
---

<div class="sec-num">01</div>

<div class="kicker">Section 01</div>

# Motivation

---

# Turn your data into a vector

If there is one habit that defines modern computing, it is this: *turn your data into a vector*.

<v-clicks>

- A $1000\times 1000$ greyscale image is a list of a million pixel brightnesses — a vector in $\R^{1\,000\,000}$.
- An audio clip is a vector of samples; a streaming user is a vector of ratings.
- A word, inside a language model, is a vector of a few hundred learned coordinates.

</v-clicks>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Once data is a vector, geometry becomes computation: similar users are *nearby* vectors, and
recommendation is finding neighbours.

</div>

</v-click>

<!--
Sell the abstraction: this chapter axiomatises exactly the operations used to blend images and mix audio.
-->

---

# Vector arithmetic captures meaning

Adding vectors and scaling them is how images are blended and audio tracks are mixed. More strikingly, in
word-vector models the sum and difference of vectors captures *meaning*:

$$
\text{king} - \text{man} + \text{woman} \approx \text{queen}
$$

is literally vector arithmetic in the sense of this chapter.

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

We will not define vectors as ``arrows'' or ``tuples'', but as elements of *any* set with a
well-behaved addition and scaling. The payoff: tuples, polynomials, matrices and functions all satisfy the
same axioms, so every theorem below holds for all of them at once.

</div>

</v-click>

---

# The question this chapter answers

How many numbers does it really take to describe your data?

<v-clicks>

- A *spanning set* is a collection of building blocks capable of expressing everything in sight.
- *Linear independence* means no building block is redundant.
- A *basis* is a minimal, lossless set of building blocks; its size — the *dimension* — is
  the honest number of degrees of freedom of the data.

</v-clicks>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Real data rarely uses all of its apparent dimensions: photographs of faces occupy a tiny, well-approximated
sliver of $\R^{1\,000\,000}$ — the reason image compression and recommender systems work at all.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">02</div>

<div class="kicker">Section 02</div>

# Vector spaces

---

# Where the axioms come from

You already know $\R^2 = \{(x,y)\mid x,y\in\R\}$, where vectors add and scale:

$$
(x_1,y_1)\oplus(x_2,y_2) = (x_1+x_2,\, y_1+y_2), \qquad \lambda\odot(x,y) = (\lambda x,\, \lambda y).
$$

<v-click>

The abstract vector space axiomatises exactly these two operations, for *any* set and *any* field
of scalars.

</v-click>

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

Let $\K$ be a field. A set $\V$ with vector addition $+$ and scalar multiplication $\cdot\colon\K\times\V\to\V$
is a *vector space* over $\K$ if:

- $\uu+\vv=\vv+\uu$ and $\uu+(\vv+\ww)=(\uu+\vv)+\ww$;
- there is $\0\in\V$ with $\vv+\0=\vv$ for all $\vv$;
- every $\vv$ has $-\vv$ with $\vv+(-\vv)=\0$;
- $\lambda\cdot(\uu+\vv)=\lambda\cdot\uu+\lambda\cdot\vv$ and $(\lambda_1+\lambda_2)\cdot\uu=\lambda_1\cdot\uu+\lambda_2\cdot\uu$;
- $(\lambda_1\lambda_2)\cdot\uu=\lambda_1\cdot(\lambda_2\cdot\uu)$ and $1\cdot\uu=\uu$.

</div>

<!--
Don't dwell on each axiom individually — the point is that this is exactly the R^2 arithmetic, generalised.
-->

---

# Free consequences of the axioms

<div class="thm rem">

<span class="lbl">Fact</span>

For any $\vv\in\V$ and $\lambda\in\K$:

$$
0\cdot\vv=\0, \qquad \lambda\cdot\0=\0, \qquad (-1)\cdot\vv=-\vv, \qquad \lambda\cdot\vv=\0 \implies \lambda=0 \text{ or } \vv=\0.
$$

</div>

<v-click>

<StepThrough :steps="['0\\cdot \\vv = (0+0)\\cdot \\vv = 0\\cdot\\vv + 0\\cdot \\vv', '\\0 = 0\\cdot\\vv']" :captions="['distributivity', 'add $-(0\cdot\vv)$ to both sides']" />

</v-click>

---

# Example: K to the n

<div class="thm ex">

<span class="lbl">Example</span>

For any field $\K$ and $n\in\N$, the set $\K^n=\{(x_1,\ldots,x_n)\mid x_i\in\K\}$ with coordinatewise
addition and scaling is a vector space, with zero vector $\0=(0,\ldots,0)$.

Taking $\K=\R,n=2$ recovers $\R^2$. Taking $\K=\C$ gives $\C^n$.

</div>

---

# Example: bit vectors

<div class="thm ex">

<span class="lbl">Example</span>

Taking $\K=\Z_2$ gives the space $\Z_2^n$ of *bit vectors*: addition is bitwise XOR, e.g. in $\Z_2^4$,

$$
(1,0,1,1)+(1,1,0,1) = (0,1,1,0).
$$

Every vector is its own additive inverse. Identifying a subset of $\{1,\ldots,n\}$ with its characteristic
vector, $\Z_2^n$ is also the set of all subsets of $\{1,\ldots,n\}$, addition becoming symmetric difference.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Vector spaces over $\Z_2$ are the natural home of error-correcting codes and appear throughout cryptography.

</div>

</v-click>

---

# More examples

<div class="cols">

<div>

<div class="thm ex">

<span class="lbl">Example</span>

$\C$ over $\R$: standard addition and multiplication by real scalars makes $\C$ a real vector space.

</div>

</div>

<div>

<div class="thm ex">

<span class="lbl">Example</span>

Polynomials $\K[x]$, with the standard operations, form a vector space; so does $\K_n[x]$, the polynomials
of degree $\leq n$.

</div>

</div>

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

For a non-empty set $X$, the functions $\K^X = \{f\colon X\to\K\}$ with pointwise operations
$(f+g)(x)=f(x)+g(x)$, $(\lambda\cdot f)(x)=\lambda f(x)$ form a vector space.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">03</div>

<div class="kicker">Section 03</div>

# Subspaces

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

$\W\subseteq\V$ is a *subspace* of $\V$ if $\W$ is itself a vector space under the same operations.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Remark — A shortcut</span>

It suffices to check three things: $\0\in\W$ (in particular $\W\neq\emptyset$), and $\W$ is closed under
$+$ and under scalar multiplication — since $\0=0\cdot\ww$ and $-\ww=(-1)\cdot\ww$ come for free. Every
$\V$ has the trivial subspaces $\{\0\}$ and $\V$.

</div>

</v-click>

---

# A plane through the origin

<div class="thm ex">

<span class="lbl">Example</span>

In $\R^3$, $W=\{(x,y,z)\mid 2x+y+3z=0\}$ is a subspace: $\0\in W$, and if $\ww_1,\ww_2\in W$ then

$$
2(x_1+x_2)+(y_1+y_2)+3(z_1+z_2) = \underbrace{(2x_1+y_1+3z_1)}_{=0} + \underbrace{(2x_2+y_2+3z_2)}_{=0} = 0,
$$

so $W$ is closed under addition (and similarly under scaling).

</div>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

$W' = \{(x,y,z)\mid x^2=1\}$ is *not* a subspace: $\0\notin W'$, and $(1,0,0)+(1,0,0)=(2,0,0)\notin W'$.

</div>

</v-click>

---

# The union trap

<div class="thm warn">

<span class="lbl">Warning</span>

The *intersection* of two subspaces is always a subspace — but their *union* usually is not.

</div>

<v-click>

In $\R^2$ the axes $W_1=\{(x,0)\}$ and $W_2=\{(0,y)\}$ are subspaces, yet

$$
(1,0)+(0,1) = (1,1) \notin W_1\cup W_2.
$$

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">04</div>

<div class="kicker">Section 04</div>

# Span

---

# Linear combinations

<div class="thm def">

<span class="lbl">Definition</span>

For scalars $a_1,\ldots,a_n\in\K$ and vectors $\vv_1,\ldots,\vv_n\in\V$, the vector
$a_1\vv_1+\ldots+a_n\vv_n$ is their *linear combination*.

</div>

<div class="thm ex">

<span class="lbl">Example</span>

In $\R^2$: $(2,3) = 2\cdot(1,1)+1\cdot(0,1)$.

</div>

---

# Span, and playing with it

<div class="cols">

<div>

<div class="thm def">

<span class="lbl">Definition</span>

$\Span{S} = \{a_1\vv_1+\ldots+a_n\vv_n \mid a_i\in\K,\ \vv_i\in S\}$ — all linear combinations of vectors
from $S$. By convention $\Span{\emptyset}=\{\0\}$.

</div>

Drag $u$ and $v$, then slide $a,b$: the marked point is $au+bv$, ranging over $\Span{\{u,v\}}$.

</div>

<div>

<div class="widget"><VecCombo  /></div>

</div>

</div>

---

# Span is a subspace

<div class="thm theo">

<span class="lbl">Theorem</span>

$\Span{\{\vv_1,\ldots,\vv_n\}}$ is a subspace of $\V$ containing $\vv_1,\ldots,\vv_n$.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Proof</span>

For $\uu=\sum a_i\vv_i$, $\ww=\sum b_i\vv_i$: $\uu+\ww=\sum(a_i+b_i)\vv_i$, $-\uu=\sum(-a_i)\vv_i$,
$\0=\sum 0\cdot\vv_i$, and $\lambda\uu=\sum(\lambda a_i)\vv_i$ — all back in the span. ∎

</div>

</v-click>

---

# Properties of span

<div class="thm rem">

<span class="lbl">Fact</span>

For $S,T\subseteq\V$:

<v-clicks>

- $S\subseteq\Span{S}$;
- $S\subseteq T \implies \Span{S}\subseteq\Span{T}$;
- $\Span{\Span{S}} = \Span{S}$;
- $\Span{S}$ is the *smallest* subspace containing $S$.

</v-clicks>

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\Span{\{1,i\}}=\C$ over $\R$, but $\Span{\{3+i\}} = \{3a+ai\mid a\in\R\}\neq\C$.

</div>

</v-click>

---

# Testing membership

Is $(1,2,3)\in\Span{\{(1,1,1),(1,0,1)\}}$ in $\R^3$? Solve $a(1,1,1)+b(1,0,1)=(1,2,3)$:

<v-click>

<StepThrough :steps="['a+b=1,   a=2,   a+b=3', '\\text{no solution} \\implies (1,2,3)\\notin\\Span{\…}']" :captions="['the three equations', 'the first and third contradict']" />

</v-click>

<v-click>

For $(3,1,3)$ the same equations give $a=1,b=2$ consistently:

$$
(3,1,3) = 1\cdot(1,1,1)+2\cdot(1,0,1)\in\Span{\{(1,1,1),(1,0,1)\}}.
$$

</v-click>

<!--
Membership in a span always reduces to solving a linear system — the systematic theory comes in the next chapter.
-->

---
class: section-slide
transition: fade
---

<div class="sec-num">05</div>

<div class="kicker">Section 05</div>

# Independence and basis

---

# Linear independence

<div class="thm def">

<span class="lbl">Definition</span>

$S\subseteq\V$ is *linearly independent* if for any $\vv_1,\ldots,\vv_n\in S$,

$$
a_1\vv_1+\ldots+a_n\vv_n=\0 \implies a_1=\ldots=a_n=0.
$$

Otherwise $S$ is *linearly dependent*.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

In $\R^2$: $\{(0,1),(1,1)\}$ is independent, since $a(0,1)+b(1,1)=(b,a+b)=(0,0)$ forces $a=b=0$.

</div>

</v-click>

---

# More independence examples

<v-clicks>

- $\C$ over $\R$: $\{1,i\}$ is independent — $a+bi=0\implies a=b=0$.
- $\R[x]$: $\{x+1,\,x-1,\,2\}$ is *dependent*: $(x+1)-(x-1)-2=0$.
- $\R[x]$: $\{1,x,x^2,x^3,\ldots\}$ is independent.

</v-clicks>

---

# Testing independence: a worked example

Are $(1,2,3),(2,1,0),(1,-4,-9)$ independent in $\R^3$? Solve $a(1,2,3)+b(2,1,0)+c(1,-4,-9)=\0$:

<v-click>

<StepThrough :steps="['a+2b+c=0,   2a+b-4c=0,   3a-9c=0', 'a=3c', 'b=-2c', '3(1,2,3) - 2(2,1,0) + 1(1,-4,-9) = (0,0,0)']" :captions="['three equations', 'third gives a in terms of c', 'substitute into the first', 'the second is then automatic; take c=1']" />

</v-click>

<v-click>

A non-trivial combination equals $\0$: the vectors are *dependent*.

</v-click>

---

# Two useful facts

<div class="thm rem">

<span class="lbl">Fact</span>

$\{\vv_1,\ldots,\vv_n\}$ is dependent iff some $\vv_i$ is a linear combination of the others.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

Every subset of an independent set is independent. Equivalently: any set containing a dependent subset is
dependent. In particular, any set containing $\0$ is dependent, since $1\cdot\0=\0$.

</div>

</v-click>

---

# Basis

<div class="thm def">

<span class="lbl">Definition</span>

$B\subseteq\V$ is a *basis* of $\V$ if $B$ is linearly independent and $\Span{B}=\V$.

</div>

<v-click>

<v-clicks>

- $\R^2$: $\{(1,0),(1,1)\}$ is a basis.
- $\C$ over $\R$: $\{1,i\}$ is a basis; so is $\{1,i+2\}$.
- $\K^n$: the *standard basis* $\{e_1,\ldots,e_n\}$, $e_i=(0,\ldots,1,\ldots,0)$.
- $\K_n[x]$: the basis $\{1,x,x^2,\ldots,x^n\}$.

</v-clicks>

</v-click>

---

# Basis = unique representation

<div class="thm theo">

<span class="lbl">Theorem</span>

$\{\vv_1,\ldots,\vv_n\}$ is a basis of $\V$ iff every $\ww\in\V$ is expressible *uniquely* as a linear
combination of the $\vv_i$.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Proof</span>

($\Rightarrow$) Two representations subtract to $\sum(a_i-b_i)\vv_i=\0$; independence forces $a_i=b_i$.\\
($\Leftarrow$) Spanning is immediate. For independence: $\0$ has the representation $\sum 0\cdot\vv_i$;
uniqueness forces any $\sum a_i\vv_i=\0$ to have all $a_i=0$. ∎

</div>

</v-click>

---

# Coordinates

<div class="thm def">

<span class="lbl">Definition</span>

For a basis $B=\{\vv_1,\ldots,\vv_n\}$ (fixed order) and $\ww=a_1\vv_1+\ldots+a_n\vv_n$, the scalars
$(a_1,\ldots,a_n)$ are the *coordinates* of $\ww$ in $B$.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

In $\R^2$ with $B=\{(1,0),(1,1)\}$: $(2,3)=-1\cdot(1,0)+3\cdot(1,1)$, so the coordinates are $(-1,3)$ — but
$(2,3)$ itself in the standard basis.

</div>

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

This is the real power of coordinates: once a basis is fixed, *any* vector — polynomial, matrix,
function — is faithfully encoded as a tuple in $\K^n$. All the matrix machinery ahead runs on this bridge.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">06</div>

<div class="kicker">Section 06</div>

# Dimension

---

# Dimension is well defined

<div class="thm theo">

<span class="lbl">Theorem</span>

If $\V$ has a finite basis, any two bases of $\V$ have the same size.

</div>

<v-click>

<div class="thm def">

<span class="lbl">Definition</span>

The *dimension* $\dim(\V)$ is the size of any basis (else $\infty$).

</div>

</v-click>

<v-click>

- $\dim(\{\0\})=0$,   $\dim(\K^n)=n$,   $\dim(\K[x])=\infty$,   $\dim(\K_n[x])=n+1$;
- $\dim(\C \text{ over } \R)=2$,   $\dim(\C \text{ over } \C)=1$.

</v-click>

---

# Counting theorems

<div class="thm theo">

<span class="lbl">Theorem</span>

If $\W\leq\V$: $\dim(\W)\leq\dim(\V)$, and if $\V$ is finite-dimensional, $\dim(\W)=\dim(\V)\implies\W=\V$.

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

Let $\dim(\V)=n$ and $S\subseteq\V$. Then:

- $\Span{S}=\V \implies |S|\geq n$;
- $S$ independent and $|S|=n \implies S$ is a basis;
- $\Span{S}=\V$ and $|S|=n \implies S$ is a basis;
- $|S|>n \implies S$ is dependent.

</div>

</v-click>

---

# Extending to a basis

<div class="thm theo">

<span class="lbl">Theorem</span>

If $\dim(\V)=n<\infty$: every independent $S\subseteq\V$ extends to a basis, and every spanning
$S\subseteq\V$ contains a basis.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\{(1,1,0)\}$ is independent in $\R^3$; it extends to the basis $\{(1,1,0),(0,1,0),(0,0,1)\}$ — three
independent vectors in a $3$-dimensional space automatically form a basis.

</div>

</v-click>

---

# Summary

<v-clicks>

- A *vector space* axiomatises addition and scalar multiplication — for any set, any field.
- A *subspace*: closed under $+$ and scaling, contains $\0$.
- *Span*: all linear combinations; *independence*: no redundancy.
- A *basis* is a minimal spanning set; its size is the *dimension*.
- **Next lecture:** matrices — the concrete bridge from abstract vectors to columns of numbers.

</v-clicks>
